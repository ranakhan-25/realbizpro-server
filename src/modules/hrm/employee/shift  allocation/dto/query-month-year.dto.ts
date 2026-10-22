/* eslint-disable prettier/prettier */

import { ApiPropertyOptional } from '@nestjs/swagger';

import {
  Transform,
  Type,
} from 'class-transformer';

import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class QueryMonthYearDto {
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
    example: 'Jan',
    description: 'Search by month name',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    example: 'January',
    description: 'Filter by month',
  })
  @IsOptional()
  @IsString()
  month?: string;

  @ApiPropertyOptional({
    example: 2026,
    description: 'Filter by year',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  year?: number;

  @ApiPropertyOptional({
    example: 'createdAt',
    default: 'createdAt',
    enum: [
      'createdAt',
      'updatedAt',
      'month',
      'year',
      'startDate',
      'endDate',
    ],
  })
  @IsOptional()
  @IsIn([
    'createdAt',
    'updatedAt',
    'month',
    'year',
    'startDate',
    'endDate',
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
