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

import { LeaveApplicationStatus } from 'src/database/models/hrm/leaveapplication/leaveapplication_modes';

export class CreateLeaveApplicationDto {
  // ---------- relations ----------

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
    description: 'Leave type UUID',
    example: 'leave-type-uuid',
  })
  @IsUUID('all', {
    message: 'Leave type id must be a valid UUID',
  })
  @IsNotEmpty({
    message: 'Leave type id is required',
  })
  leaveTypeId: string;

  // ---------- days ----------

  @ApiPropertyOptional({
    description:
      'Allocated days (max 2 decimal places)',
    example: 14,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        'Allocated days must be a number with max 2 decimal places',
    },
  )
  @Min(0)
  @Max(999999.99)
  allocatedDays?: number;

  @ApiPropertyOptional({
    description:
      'Balance days (max 2 decimal places)',
    example: 10.5,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        'Balance days must be a number with max 2 decimal places',
    },
  )
  @Min(0)
  @Max(999999.99)
  balanceDays?: number;

  // ---------- dates ----------

  @ApiProperty({
    description: 'From date (YYYY-MM-DD)',
    example: '2026-02-01',
  })
  @IsDateString(
    {},
    {
      message:
        'From date must be a valid date (YYYY-MM-DD)',
    },
  )
  fromDate: string;

  @ApiProperty({
    description: 'To date (YYYY-MM-DD)',
    example: '2026-02-05',
  })
  @IsDateString(
    {},
    {
      message:
        'To date must be a valid date (YYYY-MM-DD)',
    },
  )
  toDate: string;

  // ---------- reason ----------

  @ApiProperty({
    description: 'Reason for leave',
    example: 'Family emergency',
  })
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.trim()
      : value,
  )
  @IsString()
  @IsNotEmpty({ message: 'Reason is required' })
  reason: string;

  // ---------- status ----------

  @ApiPropertyOptional({
    description: 'Leave application status',
    enum: LeaveApplicationStatus,
    default: LeaveApplicationStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(LeaveApplicationStatus, {
    message:
      'Status must be one of: ' +
      Object.values(LeaveApplicationStatus).join(
        ', ',
      ),
  })
  status?: LeaveApplicationStatus;

  // ---------- audit ----------

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
