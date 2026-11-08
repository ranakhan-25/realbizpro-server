import { ApiPropertyOptional } from '@nestjs/swagger';
/* eslint-disable prettier/prettier */

import { IsString, IsEnum, IsOptional, IsNumberString } from 'class-validator';
import { ApprovalLayerStatus } from 'src/database/models/projects/material-requisition/pr_material_requisition.model';



export class QueryExpenseDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  project?: string;

  @IsString()
  @IsOptional()
  site?: string;

  @IsString()
  @IsOptional()
  task?: string;

  @IsString()
  @IsOptional()
  debitAccount?: string;

  @IsString()
  @IsOptional()
  creditAccount?: string;

  @IsEnum(ApprovalLayerStatus)
  @IsOptional()
  approvalStatus?: ApprovalLayerStatus;

  @IsNumberString()
  @IsOptional()
  page?: string;

  @IsNumberString()
  @IsOptional()
  limit?: string;
  @ApiPropertyOptional({ description: 'Organization ID', example: 1 })
  @IsOptional()
  orgId?: number;

  @ApiPropertyOptional({ description: 'Project UUID or ID' })
  @IsOptional()
  @IsString()
  projectId?: string;

}