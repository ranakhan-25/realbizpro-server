/* eslint-disable prettier/prettier */

import { PartialType, OmitType } from '@nestjs/mapped-types';

import { IsString, IsOptional } from 'class-validator';
import { CreateProjectBudgetDto } from './create-project_budget.dto';

// Omit fields that shouldn't be updated like projectUuid or budgetCode
export class UpdateProjectBudgetDto extends PartialType(
  OmitType(CreateProjectBudgetDto, ['projectUuid', 'budgetCode', 'addedBy', 'addedById'] as const)
) {
  @IsString()
  @IsOptional()
  updatedBy?: string;
}