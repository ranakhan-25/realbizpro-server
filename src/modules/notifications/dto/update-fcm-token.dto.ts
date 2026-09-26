import {
  IsString,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateFcmTokenDto {
  @ApiProperty({
    description:
      'Firebase Cloud Messaging device token',
    example:
      'dP8v4Q2xRZm7Kh3vN9wYjF6sL1aB8cT4eU5pM0qR...',
  })
  @IsString()
  @IsNotEmpty()
  fcmToken: string;
}
