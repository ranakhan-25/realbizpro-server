/* eslint-disable prettier/prettier */

import { ApiPropertyOptional } from '@nestjs/swagger';

import {
  Transform,
  Type,
} from 'class-transformer';

import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

import { ShareConfigurationStatus } from 'src/database/models/projects/investor/configuration.model';

export class QueryShareConfigurationDto {
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
    example: '500000',
    description:
      'Search by project ID, investor ID or added by ID',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    example:
      '550e8400-e29b-41d4-a716-446655440000',
    description: 'Filter by project UUID',
  })
  @IsOptional()
  @IsString()
  projectId?: string;

  @ApiPropertyOptional({
    example:
      '550e8400-e29b-41d4-a716-446655440001',
    description: 'Filter by investor UUID',
  })
  @IsOptional()
  @IsString()
  investorId?: string;

  @ApiPropertyOptional({
    enum: ShareConfigurationStatus,
    example: ShareConfigurationStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(ShareConfigurationStatus)
  status?: ShareConfigurationStatus;

  @ApiPropertyOptional({
    example: 'createdAt',
    default: 'createdAt',
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({
    example: 'DESC',
    default: 'DESC',
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';

  @ApiPropertyOptional({
    description:
      'Include soft-deleted configurations',
    default: false,
  })
  @IsOptional()
  @Transform(
    ({ value }) =>
      value === 'true' || value === true,
  )
  @IsBoolean()
  withDeleted?: boolean = false;
    @ApiPropertyOptional({ description: 'Filter by organization ID', example: 1 })
    @IsOptional()
    orgId?: number;
}
