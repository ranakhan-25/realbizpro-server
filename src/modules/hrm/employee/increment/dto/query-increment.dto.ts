/* eslint-disable prettier/prettier */

import {
  ApiPropertyOptional,
} from '@nestjs/swagger';

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
  IsUUID,
  Max,
  Min, IsString } from 'class-validator';
import { IncrementStatus } from 'src/database/models/hrm/employee/hrm_increment_model';

export class QueryIncrementDto {
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
    example: 'employee-uuid',
    description: 'Filter by employee',
  })
  @IsOptional()
  @IsUUID('all')
  employeeId?: string;

  @ApiPropertyOptional({
    example: 'designation-uuid',
    description: 'Filter by designation',
  })
  @IsOptional()
  @IsUUID('all')
  designationId?: string;

  @ApiPropertyOptional({
    enum: IncrementStatus,
    example: IncrementStatus.ACTIVE,
    description: 'Filter by status',
  })
  @IsOptional()
  @IsEnum(IncrementStatus)
  status?: IncrementStatus;

  @ApiPropertyOptional({
    example: '2026-01-01',
    description: 'Filter by date from (YYYY-MM-DD)',
  })
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiPropertyOptional({
    example: '2026-12-31',
    description: 'Filter by date to (YYYY-MM-DD)',
  })
  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @ApiPropertyOptional({
    example: 'createdAt',
    default: 'createdAt',
    enum: ['createdAt', 'updatedAt', 'date', 'amount', 'status'],
  })
  @IsOptional()
  @IsIn(['createdAt', 'updatedAt', 'date', 'amount', 'status'])
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
