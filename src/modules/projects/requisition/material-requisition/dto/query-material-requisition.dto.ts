/* eslint-disable prettier/prettier */

import { ApiPropertyOptional } from '@nestjs/swagger';

import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

import {
  Transform,
  Type,
} from 'class-transformer';
import { ApprovalStatus } from 'src/database/models/projects/Requisition/pr_material_requisition_model';

export class QueryMaterialRequisitionDto {
  @ApiPropertyOptional({
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    example: 20,
    default: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({
    example: 0,
    default: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  skip?: number;

  @ApiPropertyOptional({
    example: 'REQ-2026',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    example: 'REQ-2026-0001',
  })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({
    example: 'REF-2026-001',
  })
  @IsOptional()
  @IsString()
  referenceNumber?: string;

  @ApiPropertyOptional({
    example: 'Main Office Building Project',
  })
  @IsOptional()
  @IsString()
  projectName?: string;

  @ApiPropertyOptional({
    example: 'Real Estate',
  })
  @IsOptional()
  @IsString()
  projectType?: string;

  @ApiPropertyOptional({
    example: 'company-uuid-123',
  })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiPropertyOptional({
    example: 'supplier-uuid-123',
  })
  @IsOptional()
  @IsString()
  supplier?: string;

  @ApiPropertyOptional({
    example:
      'Construction of Main Office Building',
  })
  @IsOptional()
  @IsString()
  titleOrNameOfWork?: string;

  @ApiPropertyOptional({
    example: 'user-uuid-123',
  })
  @IsOptional()
  @IsString()
  addedBy?: string;

  @ApiPropertyOptional({
    example: 'PENDING',
  })
  @IsOptional()
  @IsString()
  approvalLayer?: string;

  @ApiPropertyOptional({
    enum: ApprovalStatus,
    example: ApprovalStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(ApprovalStatus)
  status?: ApprovalStatus;

  @ApiPropertyOptional({
    example: '2026-10-01',
  })
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @ApiPropertyOptional({
    example: '2026-10-31',
  })
  @IsOptional()
  @IsDateString()
  toDate?: string;

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
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';

  @ApiPropertyOptional({
    example: false,
    default: false,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  withDeleted?: boolean = false;
}
