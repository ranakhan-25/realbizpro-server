/* eslint-disable prettier/prettier */

import { IsString, IsUUID, IsEnum, IsOptional, IsNumberString } from 'class-validator';
import { CostHeadType, CostRefType } from 'src/database/models/projects/project_cost/pr_project_cost_model';
import { ApiPropertyOptional } from "@nestjs/swagger";

export class QueryProjectCostDto {
  @IsUUID()
  @IsOptional()
  projectUuid?: string;

  @IsEnum(CostHeadType)
  @IsOptional()
  costHead?: CostHeadType;

  @IsEnum(CostRefType)
  @IsOptional()
  refType?: CostRefType;

  @IsString()
  @IsOptional()
  search?: string; // Search by costCode, refNo, or approvedBy

  @IsNumberString()
  @IsOptional()
  page?: string;

  @IsNumberString()
  @IsOptional()
  limit?: string;
    @ApiPropertyOptional({ description: 'Filter by organization ID', example: 1 })
    @IsOptional()
    orgId?: number;
    @ApiPropertyOptional({ description: 'Filter by project ID' })
    @IsOptional()
    @IsString()
    projectId?: string;
}