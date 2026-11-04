/* eslint-disable prettier/prettier */
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
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import {
  IsBangladeshPhone,
  IsNormalizedUsername,
  IsPassword,
} from '../../../../common/decorators/validation.decorators';

// ─────────────────────────────────────────────
// Custom validator: confirmPassword === newPassword
// ─────────────────────────────────────────────
@ValidatorConstraint({
  name: 'MatchPassword',
  async: false,
})
export class MatchPasswordConstraint implements ValidatorConstraintInterface {
  validate(
    confirmPassword: string,
    args: ValidationArguments,
  ) {
    const obj = args.object as any;
    return confirmPassword === obj.newPassword;
  }

  defaultMessage() {
    return 'Confirm password must match new password';
  }
}

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
  // ✅ NEW: Identifier added
  @ApiProperty({
    description: 'Email or Username to identify the user',
    example: 'fleek_bd',
  })
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @ApiProperty({
    description: 'Current (old) password',
    example: 'OldPassword@123',
  })
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

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

  @ApiProperty({
    description:
      'Confirm new password (must match newPassword)',
    example: 'NewPassword@456',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  @Validate(MatchPasswordConstraint)
  confirmPassword: string;
}