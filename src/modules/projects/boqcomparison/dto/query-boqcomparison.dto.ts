/* eslint-disable prettier/prettier */

import { IsOptional, IsString, IsInt, Min, IsBoolean, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { BoqComparisonStatus } from 'src/database/models/projects/boqcomparison/boq-comparison.model';
import { ApiPropertyOptional } from "@nestjs/swagger";

export class QueryBoqComparisonDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  skip?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  titleOfWork?: string;

  @IsOptional()
  @IsString()
  task?: string;

  @IsOptional()
  @IsEnum(BoqComparisonStatus)
  status?: BoqComparisonStatus;

  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  withDeleted?: boolean = false;
    @ApiPropertyOptional({ description: 'Filter by organization ID', example: 1 })
    @IsOptional()
    orgId?: number;
    @ApiPropertyOptional({ description: 'Filter by project ID' })
    @IsOptional()
    @IsString()
    projectId?: string;
}