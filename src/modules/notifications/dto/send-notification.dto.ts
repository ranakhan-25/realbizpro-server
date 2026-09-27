import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsObject,
} from 'class-validator';
import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

export class SendNotificationDto {
  @ApiProperty({
    description: 'Device FCM token',
    example: 'dP8v4Q2xRZm...',
  })
  @ApiProperty({
    description: 'Notification title',
    example: 'New Message',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Notification message',
    example: 'You have a new notification',
  })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiPropertyOptional({
    description: 'Additional data payload',
    example: { orderId: '123', type: 'order' },
  })
  @IsOptional()
  @IsObject()
  data?: Record<string, string>;
}
