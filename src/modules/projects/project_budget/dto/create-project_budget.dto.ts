/* eslint-disable prettier/prettier */

import { 
  IsString, 
  IsUUID, 
  IsEnum, 
  IsOptional, 
  IsNumber,
  Min
} from 'class-validator';
import { Type } from 'class-transformer';
import { BudgetCategoryType, BudgetStatus } from 'src/database/models/projects/project_budget/pr_project_budget_model';
import { ApiPropertyOptional } from "@nestjs/swagger";

export class CreateProjectBudgetDto {
  @IsUUID()
  projectUuid: string;

  @IsString()
  budgetCode: string;

  @IsEnum(BudgetCategoryType)
  category: BudgetCategoryType;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  plannedAmount: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  revisedAmount?: number;

  @IsEnum(BudgetStatus)
  @IsOptional()
  status?: BudgetStatus;

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