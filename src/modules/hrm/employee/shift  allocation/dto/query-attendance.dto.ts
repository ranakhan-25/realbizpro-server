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
import { AttendanceType } from 'src/database/models/hrm/employee/hrm_attendance_model';

export class QueryAttendanceDto {
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
    example: 'Tuesday',
    description: 'Search by day, note or comment',
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
    example: 'month-year-uuid',
    description: 'Filter by month-year',
  })
  @IsOptional()
  @IsUUID('all')
  monthYearId?: string;

  @ApiPropertyOptional({
    example: 'department-uuid',
    description: 'Filter by department',
  })
  @IsOptional()
  @IsUUID('all')
  departmentId?: string;

  @ApiPropertyOptional({
    example: 'shift-uuid',
    description: 'Filter by shift',
  })
  @IsOptional()
  @IsUUID('all')
  shiftId?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Filter by present / absent',
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
  isPresent?: boolean;

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
    example: '2026-10-13',
    description: 'Filter by date (YYYY-MM-DD)',
  })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'date must be in YYYY-MM-DD format',
  })
  date?: string;

  @ApiPropertyOptional({
    enum: AttendanceType,
    example: AttendanceType.WORKDAY,
    description: 'Filter by attendance type',
  })
  @IsOptional()
  @IsEnum(AttendanceType)
  type?: AttendanceType;

  @ApiPropertyOptional({
    example: 'createdAt',
    default: 'createdAt',
    enum: [
      'createdAt',
      'updatedAt',
      'date',
      'day',
      'type',
      'isPresent',
      'hours',
    ],
  })
  @IsOptional()
  @IsIn([
    'createdAt',
    'updatedAt',
    'date',
    'day',
    'type',
    'isPresent',
    'hours',
  ])
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
}
