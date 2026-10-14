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
import { BonusStatus } from 'src/database/models/hrm/employee/hrm_bonus_model';

export class QueryBonusDto {
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
    description: 'Search by bonus name',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    enum: BonusStatus,
    example: BonusStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(BonusStatus)
  status?: BonusStatus;

  @ApiPropertyOptional({
    example: '2026-01-01',
    description: 'Festival date from (inclusive)',
  })
  @IsOptional()
  @IsDateString()
  festivalDateFrom?: string;

  @ApiPropertyOptional({
    example: '2026-12-31',
    description: 'Festival date to (inclusive)',
  })
  @IsOptional()
  @IsDateString()
  festivalDateTo?: string;

  @ApiPropertyOptional({
    example: 'createdAt',
    default: 'createdAt',
    enum: [
      'createdAt',
      'updatedAt',
      'name',
      'percentage',
      'festivalDate',
      'status',
    ],
  })
  @IsOptional()
  @IsIn([
    'createdAt',
    'updatedAt',
    'name',
    'percentage',
    'festivalDate',
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
    description: 'Include soft-deleted bonuses',
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
