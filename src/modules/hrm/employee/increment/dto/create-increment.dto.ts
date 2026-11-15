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
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { IncrementStatus } from 'src/database/models/hrm/employee/hrm_increment_model';

export class CreateIncrementDto {
  @ApiProperty({
    description: 'Increment date (YYYY-MM-DD)',
    example: '2026-01-01',
  })
  @IsDateString(
    {},
    { message: 'Date must be a valid date (YYYY-MM-DD)' },
  )
  @IsNotEmpty({ message: 'Date is required' })
  date: string;

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
    description: 'Designation UUID',
    example: 'designation-uuid',
  })
  @IsUUID('all', {
    message: 'Designation id must be a valid UUID',
  })
  @IsNotEmpty({ message: 'Designation id is required' })
  designationId: string;

  @ApiProperty({
    description: 'Increment amount (max 2 decimal places)',
    example: 5000,
  })
  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        'Amount must be a number with max 2 decimal places',
    },
  )
  @Min(0)
  @Max(9999999999.99)
  amount: number;

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

  @ApiPropertyOptional({
    description: 'Increment status',
    enum: IncrementStatus,
    default: IncrementStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(IncrementStatus)
  status?: IncrementStatus;
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
