/* eslint-disable prettier/prettier */

import { 
  IsString, 
  IsUUID, 
  IsEnum, 
  IsOptional, 
  IsNumber,
  Min,
  IsISO8601 // ✅ IsDateString এর বদলে IsISO8601 ব্যবহার করুন
} from 'class-validator';
import { Type } from 'class-transformer';
import { CostHeadType, CostRefType } from 'src/database/models/projects/project_cost/pr_project_cost_model';
import { ApiPropertyOptional } from "@nestjs/swagger";

export class CreateProjectCostDto {
  @IsUUID()
  projectUuid: string;

  @IsString()
  costCode: string;

  @IsEnum(CostHeadType)
  costHead: CostHeadType;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  amount: number;

  // ✅ Fix: Type 'string' করুন এবং IsISO8601 ব্যবহার করুন
  @IsISO8601({ strict: true }, { message: 'incurredAt must be a valid ISO 8601 date string' })
  incurredAt: string;

  @IsEnum(CostRefType)
  refType: CostRefType;

  @IsUUID()
  @IsOptional()
  refUuid?: string;

  @IsString()
  @IsOptional()
  refNo?: string; // If empty, service will auto-generate

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  attachmentUrl?: string;

  @IsString()
  @IsOptional()
  approvedBy?: string;

  @IsString()
  @IsOptional()
  addedBy?: string;

  @IsString()
  @IsOptional()
  addedById?: string;
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    createdBy?: string;
    @ApiPropertyOptional({ description: 'Organization ID', example: 1 })
    @IsOptional()
    orgId?: number;
    @ApiPropertyOptional({ description: 'Project UUID or ID' })
    @IsOptional()
    @IsString()
    projectId?: string;
}