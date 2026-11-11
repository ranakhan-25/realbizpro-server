/* eslint-disable prettier/prettier */

import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiPropertyOptional } from "@nestjs/swagger";

export class QueryServiceWorkRequisitionItemDto {
  @IsUUID()
  @IsOptional()
  serviceWorkRequisitionId?: string;

  @IsDateString()
  @IsOptional()
  date?: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  serviceItemName?: string;

  @IsString()
  @IsOptional()
  unitType?: string;

  @IsNumberString()
  @IsOptional()
  qtyDays?: string;

  @IsNumberString()
  @IsOptional()
  rate?: string;

  @IsNumberString()
  @IsOptional()
  amount?: string;

  @IsString()
  @IsOptional()
  createdBy?: string;

  @IsString()
  @IsOptional()
  updatedBy?: string;

  @IsString()
  @IsOptional()
  deletedBy?: string;

  // =========================
  // PAGINATION
  // =========================

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 10;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  skip?: number;

  // =========================
  // SEARCH
  // =========================

  @IsString()
  @IsOptional()
  search?: string;

  // =========================
  // SORT
  // =========================

  @IsString()
  @IsOptional()
  sortBy?: string;

  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC';

  // =========================
  // SOFT DELETE
  // =========================

  @Transform(({ value }) =>
    value === 'true' ? true : value === 'false' ? false : value,
  )
  @IsBoolean()
  @IsOptional()
  withDeleted?: boolean = false;
    @ApiPropertyOptional({ description: 'Filter by organization ID', example: 1 })
    @IsOptional()
    orgId?: number;
    @ApiPropertyOptional({ description: 'Filter by project ID' })
    @IsOptional()
    @IsString()
    projectId?: string;
}