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
  Max,
  Min,
} from 'class-validator';
import { HolidayStatus } from 'src/database/models/hrm/configuration/holiday_model';

export class QueryHolidayDto {
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
    example: 'Eid',
    description:
      'Search by reason or description',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    enum: HolidayStatus,
    example: HolidayStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(HolidayStatus)
  status?: HolidayStatus;

  @ApiPropertyOptional({
    example: '2026-01-01',
    description:
      'Holidays ending on/after this date',
  })
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiPropertyOptional({
    example: '2026-12-31',
    description:
      'Holidays starting on/before this date',
  })
  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @ApiPropertyOptional({
    example: 'createdAt',
    default: 'createdAt',
    enum: [
      'createdAt',
      'updatedAt',
      'reason',
      'fromDate',
      'toDate',
      'status',
    ],
  })
  @IsOptional()
  @IsIn([
    'createdAt',
    'updatedAt',
    'reason',
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
}
