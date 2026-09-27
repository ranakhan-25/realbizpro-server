import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  MinLength,
} from 'class-validator';

export class MobileUserPasswordChangeDto {
  @ApiProperty({
    example: 'OldPassword123!',
    description: 'Current password',
  })
  @IsString()
  @MinLength(6)
  oldPassword!: string;

  @ApiProperty({
    example: 'NewPassword123!',
    description: 'New password',
  })
  @IsString()
  @MinLength(6)
  newPassword!: string;

  @ApiProperty({
    example: 'NewPassword123!',
    description: 'Confirm new password',
  })
  @IsString()
  @MinLength(6)
  confirmPassword!: string;
}
