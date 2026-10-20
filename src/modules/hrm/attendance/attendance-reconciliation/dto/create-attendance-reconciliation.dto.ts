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
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Max,
  Min,
} from 'class-validator';
import {
  AttendanceReconciliationRequestType,
  AttendanceReconciliationStatus,
} from 'src/database/models/hrm/attendance/attendance_reconciliation_model';

export class CreateAttendanceReconciliationDto {
  @ApiProperty({
    description: 'Employee UUID',
    example:
      '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID('all', {
    message: 'Employee id must be a valid UUID',
  })
  @IsNotEmpty({
    message: 'Employee id is required',
  })
  employeeId: string;

  @ApiProperty({
    description: 'Date (YYYY-MM-DD)',
    example: '2026-10-13',
  })
  @IsString()
  @IsNotEmpty({ message: 'Date is required' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'date must be in YYYY-MM-DD format',
  })
  date: string;

  @ApiPropertyOptional({
    description: 'Late minutes',
    example: 15,
    default: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({
    message: 'Late minutes must be an integer',
  })
  @Min(0)
  @Max(1440)
  lateMinutes?: number;

  @ApiProperty({
    description: 'Request type',
    enum: AttendanceReconciliationRequestType,
    example:
      AttendanceReconciliationRequestType.IGNORE_LATE,
  })
  @IsEnum(AttendanceReconciliationRequestType, {
    message:
      'Request type must be one of: ' +
      Object.values(
        AttendanceReconciliationRequestType,
      ).join(', '),
  })
  requestType: AttendanceReconciliationRequestType;

  @ApiPropertyOptional({
    description: 'Reason',
    example: 'Traffic jam',
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === ''
      ? null
      : typeof value === 'string'
        ? value.trim()
        : value,
  )
  @IsString()
  reason?: string;

  @ApiPropertyOptional({
    description: 'Attachment (url/path)',
    example: 'uploads/proof.pdf',
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === ''
      ? null
      : typeof value === 'string'
        ? value.trim()
        : value,
  )
  @IsString()
  attachment?: string;

  @ApiPropertyOptional({
    description: 'Status',
    enum: AttendanceReconciliationStatus,
    default:
      AttendanceReconciliationStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(AttendanceReconciliationStatus)
  status?: AttendanceReconciliationStatus;

  @ApiPropertyOptional({
    description: 'Approved by (user ID / name)',
    example: 'user-uuid',
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  @IsString()
  approvedBy?: string;

  @ApiPropertyOptional({
    description:
      'Is approved (auto-synced from status)',
    default: false,
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === 'true'
      ? true
      : value === 'false'
        ? false
        : value,
  )
  @IsBoolean()
  isApproved?: boolean;

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
