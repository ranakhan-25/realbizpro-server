/* eslint-disable prettier/prettier */

import { ApiPropertyOptional } from '@nestjs/swagger';

import {
  Transform,
  Type,
} from 'class-transformer';

import {
  IsBoolean,
  IsEnum,
  IsIn,
  IsInt,
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

const SORT_FIELDS = [
  'createdAt',
  'updatedAt',
  'date',
  'lateMinutes',
  'requestType',
  'status',
];

export class QueryAttendanceReconciliationDto {
  @ApiPropertyOptional({
    example: 1,
    default: 1,
    description: 'Current page number',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    example: 10,
    default: 10,
    description: 'Items per page',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({
    example: 0,
    description:
      'Number of records to skip (alternative to page)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  skip?: number;

  @ApiPropertyOptional({
    example: 'traffic',
    description: 'Search by reason',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    example: 'employee-uuid',
    description: 'Filter by employee',
  })
  @IsOptional()
  @IsUUID('all')
  employeeId?: string;

  @ApiPropertyOptional({
    example: '2026-10-13',
    description: 'Filter by date (YYYY-MM-DD)',
  })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'date must be in YYYY-MM-DD format',
  })
  date?: string;

  @ApiPropertyOptional({
    example: '2026-10-01',
    description: 'Date from (YYYY-MM-DD)',
  })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message:
      'dateFrom must be in YYYY-MM-DD format',
  })
  dateFrom?: string;

  @ApiPropertyOptional({
    example: '2026-10-31',
    description: 'Date to (YYYY-MM-DD)',
  })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message:
      'dateTo must be in YYYY-MM-DD format',
  })
  dateTo?: string;

  @ApiPropertyOptional({
    enum: AttendanceReconciliationRequestType,
    description: 'Filter by request type',
  })
  @IsOptional()
  @IsEnum(AttendanceReconciliationRequestType)
  requestType?: AttendanceReconciliationRequestType;

  @ApiPropertyOptional({
    enum: AttendanceReconciliationStatus,
    description: 'Filter by status',
  })
  @IsOptional()
  @IsEnum(AttendanceReconciliationStatus)
  status?: AttendanceReconciliationStatus;

  @ApiPropertyOptional({
    example: false,
    description:
      'Filter by approved / not approved',
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
    example: 'createdAt',
    default: 'createdAt',
    enum: SORT_FIELDS,
  })
  @IsOptional()
  @IsIn(SORT_FIELDS)
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({
    example: 'DESC',
    default: 'DESC',
    enum: ['ASC', 'DESC'],
  })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';

  @ApiPropertyOptional({
    description: 'Include soft-deleted records',
    default: false,
  })
  @IsOptional()
  @Transform(
    ({ value }) =>
      value === 'true' || value === true,
  )
  @IsBoolean()
  withDeleted?: boolean = false;
    @ApiPropertyOptional({ description: 'Organization ID', example: 1 })
    @IsOptional()
    orgId?: number;
    @ApiPropertyOptional({ description: 'Project UUID or ID' })
    @IsOptional()
    @IsString()
    projectId?: string;
}
