import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import {
  IsBangladeshPhone,
  IsNormalizedUsername,
  IsPassword,
} from '../../../../common/decorators/validation.decorators';

export class RefreshTokenDto {
  @ApiProperty({
    description:
      'Refresh token for getting new access token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

export class UpdateProfileDto {
  @ApiPropertyOptional({
    description: 'User first name',
    example: 'John',
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({
    description: 'User last name',
    example: 'Doe',
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({
    description: 'User phone number',
    example: '+8801234567890',
  })
  @IsOptional()
  @IsBangladeshPhone()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Email address',
    example: 'john@example.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description:
      'Username (alphanumeric and underscores only)',
    example: 'john_doe',
    minLength: 3,
  })
  @IsOptional()
  @IsString()
  @IsNormalizedUsername()
  @MinLength(3)
  username?: string;
}

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Current password',
    example: 'CurrentPassword@123',
  })
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty({
    description:
      'New password (must contain uppercase, lowercase, number, and special character)',
    example: 'NewPassword@456',
    minLength: 8,
  })
  @IsString()
  @IsPassword()
  @MinLength(8)
  newPassword: string;
}
