import {
  Controller,
  Post,
  Body,
  UseGuards,
  Put,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { NotificationService } from './notifications.service';
import { SendNotificationDto } from './dto/send-notification.dto';
import { UpdateFcmTokenDto } from './dto/update-fcm-token.dto';
import { CurrentUserId } from '@/common/decorators/auth.decorators';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
  ) {}

  @Post('send')
  @ApiOperation({
    summary: 'Send notification to device token',
  })
  async send(
    @CurrentUserId() userId: number,
    @Body() dto: SendNotificationDto,
  ) {
    // The token field is no longer needed; we use the user's stored FCM token.
    return this.notificationService.sendToToken(
      userId,
      dto.title,
      dto.message,
      dto.data,
    );
  }

  @Put('fcm-token')
  @ApiOperation({
    summary: 'Update FCM token for current user',
  })
  updateFcmToken(
    @CurrentUserId() userId: number,
    @Body() dto: UpdateFcmTokenDto,
  ) {
    return this.notificationService.updateUserFcmToken(
      userId,
      dto.fcmToken,
    );
  }
}
