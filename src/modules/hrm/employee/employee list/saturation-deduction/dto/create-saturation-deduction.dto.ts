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
import { PaymentType } from 'src/database/models/hrm/employee/hrm_payment_enum';

export class CreateSaturationDeductionDto {
  @ApiProperty({
    description: 'Employee UUID',
    example: 'employee-uuid',
  })
  @IsUUID('all', {
    message: 'Employee id must be a valid UUID',
  })
  @IsNotEmpty({
    message: 'Employee id is required',
  })
  employeeId: string;

  @ApiProperty({
    description: 'Deduction title',
    example: 'Saturday Deduction',
  })
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.trim()
      : value,
  )
  @IsString()
  @IsNotEmpty({
    message: 'Deduction title is required',
  })
  title: string;

  @ApiProperty({
    description:
      'Deduction amount (max 2 decimal places)',
    example: 500,
  })
  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        'Deduction amount must be a number with max 2 decimal places',
    },
  )
  @Min(0)
  @Max(9999999999.99)
  amount: number;

  @ApiPropertyOptional({
    description: 'Payment type',
    enum: PaymentType,
  })
  @IsOptional()
  @IsEnum(PaymentType, {
    message:
      'Payment type must be one of: ' +
      Object.values(PaymentType).join(', '),
  })
  paymentType?: PaymentType;

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
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    createdBy?: string;
    @ApiPropertyOptional({ description: 'Organization ID', example: 1 })
    @IsOptional()
    orgId?: number;
    @ApiPropertyOptional({ description: 'Project UUID or ID' })
    @IsOptional()
    @IsString()
    projectId?: string;
}
