/* eslint-disable prettier/prettier */

import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import {
  Transform,
  Type,
} from 'class-transformer';

import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import {
  AllowanceType,
  PaymentType,
} from 'src/database/models/hrm/employee/hrm_payment_enum';

export class CreateAllowanceDto {
  @ApiProperty({
    description: 'Employee UUID',
    example: 'employee-uuid',
  })
  @IsUUID('all', {
    message: 'Employee id must be a valid UUID',
  })
  @IsNotEmpty({ message: 'Employee id is required' })
  employeeId: string;

  @ApiProperty({
    description: 'Allowance purpose',
    example: 'House Rent',
  })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @IsNotEmpty({
    message: 'Allowance purpose is required',
  })
  purpose: string;

  @ApiProperty({
    description: 'Allowance type',
    enum: AllowanceType,
  })
  @IsEnum(AllowanceType, {
    message: 'Allowance type must be one of: ' + Object.values(AllowanceType).join(', '),
  })
  type: AllowanceType;

  @ApiProperty({
    description: 'Payment type',
    enum: PaymentType,
  })
  @IsEnum(PaymentType, {
    message: 'Payment type must be one of: ' + Object.values(PaymentType).join(', '),
  })
  paymentType: PaymentType;

  @ApiPropertyOptional({
    description:
      'Percentage (0 - 100, required when type is percentage)',
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        'Percentage must be a number with max 2 decimal places',
    },
  )
  @Min(0)
  @Max(100)
  percentage?: number;

  @ApiPropertyOptional({
    description: 'Allowance amount (max 2 decimal places)',
    example: 5000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        'Allowance amount must be a number with max 2 decimal places',
    },
  )
  @Min(0)
  @Max(9999999999.99)
  amount?: number;

  @ApiPropertyOptional({
    description: 'Added by user ID',
    example: 'user-uuid',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  addedById?: string;
}
