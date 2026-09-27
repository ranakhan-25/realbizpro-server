import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import argon2 from 'argon2';
import bcrypt from 'bcrypt';

import { StatusEnumD } from '@/database/enum/status.enum';
import { QueryMobileUserDto } from './dto/query-mobile-user.dto';
import { UpdateMobileUserStatusDto } from './dto/update-mobile-user-status.dto';
import { MobileUserPasswordChangeDto } from './dto/mobile-user-password-change.dto';

type MobileUserListItem = {
  id: number;
  uuid: string;
  employeeCode: string;
  username: string;
  email: string;
  phone?: string | null;
  isFaceRegistered: boolean;
  isEmailVerified: boolean;
  emailVerifiedAt?: Date | null;
  status: StatusEnumD;
  createdAt: Date;
  updatedAt: Date;
  employee?: {
    id: number;
    employeeCode?: string;
    employeeName?: string;
    employeeNameBn?: string;
    officialEmail?: string;
    officeId?: number | null;
    floorId?: number | null;
    sectionId?: number | null;
  } | null;
};

@Injectable()
export class MobileUserService {
  constructor() {}

  private getEmployeeInclude() {
    return {
      association: 'employee' as const,
      attributes: [
        'id',
        'employeeCode',
        'employeeName',
        'employeeNameBn',
        'officialEmail',
        'officeId',
        'floorId',
        'sectionId',
      ],
      required: false,
    };
  }

  private async verifyPassword(
    passwordHash: string,
    plainPassword: string,
  ): Promise<boolean> {
    if (passwordHash?.startsWith('$argon2')) {
      try {
        return await argon2.verify(
          passwordHash,
          plainPassword,
        );
      } catch {
        return false;
      }
    }

    if (
      passwordHash?.startsWith('$2a$') ||
      passwordHash?.startsWith('$2b$') ||
      passwordHash?.startsWith('$2y$')
    ) {
      try {
        return await bcrypt.compare(
          plainPassword,
          passwordHash,
        );
      } catch {
        return false;
      }
    }

    return passwordHash === plainPassword;
  }

  private mapMobileUser(
    mobileUser: any,
  ): MobileUserListItem {
    return {
      id: mobileUser.id,
      uuid: mobileUser.uuid,
      employeeCode: mobileUser.employeeCode,
      username: mobileUser.username,
      email: mobileUser.email,
      phone: mobileUser.phone,
      isFaceRegistered: mobileUser.faceRegistered,
      isEmailVerified: mobileUser.emailVerified,
      emailVerifiedAt:
        mobileUser.emailVerifiedAt ?? null,
      status: mobileUser.status,
      createdAt: mobileUser.createdAt,
      updatedAt: mobileUser.updatedAt,
      employee: mobileUser.employee
        ? {
            id: mobileUser.employee.id,
            employeeCode:
              mobileUser.employee.employeeCode,
            employeeName:
              mobileUser.employee.employeeName,
            employeeNameBn:
              mobileUser.employee.employeeNameBn,
            officialEmail:
              mobileUser.employee.officialEmail,
            officeId:
              mobileUser.employee.officeId,
            floorId: mobileUser.employee.floorId,
            sectionId:
              mobileUser.employee.sectionId,
          }
        : null,
    };
  }

  findAndCount(query: QueryMobileUserDto) {
    const page = Math.max(
      Number(query.page || 1),
      1,
    );
    const limit = Math.max(
      Number(query.limit || 10),
      1,
    );
    const offset = (page - 1) * limit;
    const search = query.search?.trim();

    const where: any = {};

    if (search) {
      where[Op.or] = [
        {
          username: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          email: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          employeeCode: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          phone: {
            [Op.iLike]: `%${search}%`,
          },
        },
      ];
    }

    return (this as any).mobileUserModel
      .findAndCountAll({
        where,
        include: [this.getEmployeeInclude()],
        order: [['createdAt', 'DESC']],
        offset,
        limit,
        distinct: true,
        col: 'id',
      })
      .then(
        ({ rows, count }) =>
          [
            rows.map((item) =>
              this.mapMobileUser(item),
            ),
            count,
          ] as const,
      );
  }

  async updateStatus(
    uuid: string,
    dto: UpdateMobileUserStatusDto,
    updatedBy?: number,
  ) {
    const mobileUserUuid = uuid?.trim();

    if (!mobileUserUuid) {
      throw new BadRequestException(
        'Mobile user uuid is required',
      );
    }

    const mobileUser = await (
      this as any
    ).mobileUserModel.findOne({
      where: {
        uuid: mobileUserUuid,
      },
      include: [this.getEmployeeInclude()],
    });

    if (!mobileUser) {
      throw new NotFoundException(
        'Mobile user not found',
      );
    }

    const updateData: Record<string, any> = {};

    if (dto.isFaceRegistered !== undefined) {
      updateData.faceRegistered =
        dto.isFaceRegistered;
    }

    if (dto.isEmailVerified !== undefined) {
      updateData.emailVerified =
        dto.isEmailVerified;
      updateData.emailVerifiedAt =
        dto.isEmailVerified ? new Date() : null;
    }

    if (dto.status !== undefined) {
      updateData.status = dto.status;
    }

    if (
      updatedBy !== undefined &&
      updatedBy !== null
    ) {
      updateData.updatedBy = updatedBy;
    }

    if (!Object.keys(updateData).length) {
      throw new BadRequestException(
        'At least one field must be provided',
      );
    }

    await mobileUser.update(updateData);

    return {
      success: true,
      message: 'Mobile user updated successfully',
      data: this.mapMobileUser(mobileUser),
    };
  }

  async changePassword(
    userId: number,
    dto: MobileUserPasswordChangeDto,
  ) {
    if (!userId) {
      throw new UnauthorizedException(
        'Authenticated mobile user not found',
      );
    }

    if (dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException(
        'New password and confirm password do not match',
      );
    }

    const mobileUser = await (
      this as any
    ).mobileUserModel.findByPk(userId);

    if (!mobileUser) {
      throw new NotFoundException(
        'Mobile user not found',
      );
    }

    const oldPasswordMatched =
      await this.verifyPassword(
        mobileUser.password,
        dto.oldPassword,
      );

    if (!oldPasswordMatched) {
      throw new UnauthorizedException(
        'Old password is incorrect',
      );
    }

    const hashedPassword = await bcrypt.hash(
      dto.newPassword,
      10,
    );

    await mobileUser.update({
      password: hashedPassword,
      passwordChangedAt: new Date(),
      failedLoginAttempt: 0,
      accountLocked: false,
      lockedAt: null,
    });

    return {
      success: true,
      message: 'Password updated successfully',
    };
  }
}
