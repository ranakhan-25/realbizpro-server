import {
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as admin from 'firebase-admin';
import { SysUser } from '../../database/models/system/sys_user.model';
import { SysNotification } from '../../database/models/system/sys_notification.model';
import { Op } from 'sequelize';

@Injectable()
export class NotificationService {
  constructor(
    @Inject('FIREBASE_ADMIN')
    private readonly firebase: typeof admin,
    @InjectModel(SysUser)
    private userModel: typeof SysUser,
    @InjectModel(SysNotification)
    private notificationModel: typeof SysNotification,
  ) {}

  async sendToToken(
    userId: number,
    title: string,
    body: string,
    data: Record<string, any> = {},
  ) {
    // Get user's FCM token from database
    const user = await this.userModel.findByPk(
      userId,
      {
        attributes: ['fcmToken'],
      },
    );

    if (!user?.fcmToken) {
      // Save notification to database even without token
      await this.notificationModel.create({
        title,
        message: body,
        data,
        userId,
        isRead: false,
      });
      throw new Error(
        'User does not have an FCM token',
      );
    }

    try {
      // Save notification to database first to get the ID
      const notification =
        await this.notificationModel.create({
          title,
          message: body,
          data,
          userId,
          isRead: false,
        });

      // Add notificationId to data
      const fcmData = {
        ...data,
        notificationId:
          notification.id.toString(),
      };

      // Send FCM notification
      const result = await this.firebase
        .messaging()
        .send({
          token: user.fcmToken,
          notification: { title, body },
          data: this.convertDataToStringRecord(
            fcmData,
          ),
        });

      return result;
    } catch (error: any) {
      if (
        error.code ===
          'messaging/invalid-registration-token' ||
        error.code ===
          'messaging/registration-token-not-registered'
      ) {
        // Clear invalid token from database
        await this.userModel.update(
          { fcmToken: null },
          { where: { id: userId } },
        );
        throw new Error('Invalid FCM token');
      }
      throw error;
    }
  }

  async sendToMultipleTokens(
    tokens: string[],
    title: string,
    body: string,
  ) {
    return this.firebase
      .messaging()
      .sendEachForMulticast({
        tokens,
        notification: { title, body },
      });
  }

  async updateUserFcmToken(
    userId: number,
    fcmToken: string,
  ) {
    await this.userModel.update(
      { fcmToken },
      { where: { id: userId } },
    );
    return {
      message: 'FCM token updated successfully',
    };
  }

  async getMyNotifications(
    userId: number,
    dto: any,
  ) {
    let { isRead, page = 1, limit = 20 } = dto;
    const offset = (page - 1) * limit;

    // Transform isRead if it's a string
    if (typeof isRead === 'string') {
      if (isRead === 'true' || isRead === '1') {
        isRead = true as any;
      } else if (
        isRead === 'false' ||
        isRead === '0' ||
        isRead === ''
      ) {
        isRead = false as any;
      } else {
        isRead = undefined;
      }
    }

    console.log({
      isRead,
      type: typeof isRead,
    });

    const where: any = { userId };
    if (isRead !== undefined) {
      where.isRead = isRead;
    }

    const { rows, count } =
      await this.notificationModel.findAndCountAll(
        {
          where,
          order: [['createdAt', 'DESC']],
          limit,
          offset,
        },
      );

    // Get unread count
    const unreadCount =
      await this.notificationModel.count({
        where: {
          userId,
          isRead: false,
        },
      });

    return {
      data: rows,
      unreadCount,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  async markAsRead(
    userId: number,
    notificationIds: number[],
  ) {
    const [updatedCount] =
      await this.notificationModel.update(
        {
          isRead: true,
          readAt: new Date(),
        },
        {
          where: {
            id: {
              [Op.in]: notificationIds,
            },
            userId,
          },
        },
      );

    return {
      message: `${updatedCount} notification(s) marked as read`,
      count: updatedCount,
    };
  }

  /**
   * Convert data object to string record for FCM
   * FCM requires all data values to be strings
   */
  private convertDataToStringRecord(
    data: Record<string, any>,
  ): Record<string, string> {
    const stringRecord: Record<string, string> =
      {};
    for (const [key, value] of Object.entries(
      data,
    )) {
      stringRecord[key] =
        typeof value === 'string'
          ? value
          : JSON.stringify(value);
    }
    return stringRecord;
  }
}
