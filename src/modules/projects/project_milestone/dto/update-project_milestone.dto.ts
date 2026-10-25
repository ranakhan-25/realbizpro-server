/* eslint-disable prettier/prettier */
import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateProjectMilestoneDto } from './create-project_milestone.dto'; // ✅ সঠিক পাথ
import { IsString, IsOptional } from 'class-validator';

export class UpdateProjectMilestoneDto extends PartialType(
  OmitType(CreateProjectMilestoneDto, ['projectUuid', 'milestoneCode', 'addedBy'] as const)
) {
  @IsString()
  @IsOptional()
  updatedBy?: string;
}