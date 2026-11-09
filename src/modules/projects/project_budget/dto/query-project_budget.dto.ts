/* eslint-disable prettier/prettier */

import { IsString, IsUUID, IsEnum, IsOptional, IsNumberString } from 'class-validator';
import { BudgetCategoryType, BudgetStatus } from 'src/database/models/projects/project_budget/pr_project_budget_model';
import { ApiPropertyOptional } from "@nestjs/swagger";

export class QueryProjectBudgetDto {
  @IsUUID()
  @IsOptional()
  projectUuid?: string;

  @IsEnum(BudgetCategoryType)
  @IsOptional()
  category?: BudgetCategoryType;

  @IsEnum(BudgetStatus)
  @IsOptional()
  status?: BudgetStatus;

  @IsString()
  @IsOptional()
  search?: string; // Search by category or budgetCode

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