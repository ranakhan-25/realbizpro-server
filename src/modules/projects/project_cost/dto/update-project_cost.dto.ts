/* eslint-disable prettier/prettier */

import { PartialType, OmitType } from '@nestjs/mapped-types';

import { IsString, IsOptional } from 'class-validator';
import { CreateProjectCostDto } from './create-project_cost.dto';

export class UpdateProjectCostDto extends PartialType(
  OmitType(CreateProjectCostDto, ['projectUuid', 'costCode', 'addedBy', 'addedById'] as const)
) {
  @IsString()
  @IsOptional()
  updatedBy?: string;
}