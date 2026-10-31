/* eslint-disable prettier/prettier */
import { ApiPropertyOptional } from '@nestjs/swagger';

import {
  Transform,
  Type,
} from 'class-transformer';

import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

import { LeaveApplicationStatus } from 'src/database/models/hrm/leaveapplication/leaveapplication_modes';

export class QueryLeaveApplicationDto {
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
    example: 'emergency',
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
    example: 'leave-type-uuid',
    description: 'Filter by leave type',
  })
  @IsOptional()
  @IsUUID('all')
  leaveTypeId?: string;

  @ApiPropertyOptional({
    enum: LeaveApplicationStatus,
    example: LeaveApplicationStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(LeaveApplicationStatus)
  status?: LeaveApplicationStatus;

  @ApiPropertyOptional({
    example: '2026-02-01',
    description: 'From date from (inclusive)',
  })
  @IsOptional()
  @IsDateString()
  fromDateFrom?: string;

  @ApiPropertyOptional({
    example: '2026-02-28',
    description: 'From date to (inclusive)',
  })
  @IsOptional()
  @IsDateString()
  fromDateTo?: string;

  @ApiPropertyOptional({
    example: '2026-02-01',
    description: 'To date from (inclusive)',
  })
  @IsOptional()
  @IsDateString()
  toDateFrom?: string;

  @ApiPropertyOptional({
    example: '2026-02-28',
    description: 'To date to (inclusive)',
  })
  @IsOptional()
  @IsDateString()
  toDateTo?: string;

  @ApiPropertyOptional({
    example: 'createdAt',
    default: 'createdAt',
    enum: [
      'createdAt',
      'updatedAt',
      'fromDate',
      'toDate',
      'status',
    ],
  })
  @IsOptional()
  @IsIn([
    'createdAt',
    'updatedAt',
    'fromDate',
    'toDate',
    'status',
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
    description:
      'Include employee and leave type details',
    default: false,
  })
  @IsOptional()
  @Transform(
    ({ value }) =>
      value === 'true' || value === true,
  )
  @IsBoolean()
  withRelations?: boolean = false;

  @ApiPropertyOptional({
    description:
      'Include soft-deleted applications',
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

export class FindOneLeaveApplicationQueryDto {
  @ApiPropertyOptional({
    description:
      'Include employee and leave type details',
    default: false,
  })
  @IsOptional()
  @Transform(
    ({ value }) =>
      value === 'true' || value === true,
  )
  @IsBoolean()
  withRelations?: boolean = false;
}
