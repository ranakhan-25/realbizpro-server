/* eslint-disable prettier/prettier */

import { OmitType, PartialType } from '@nestjs/mapped-types';

import { IsString, IsOptional } from 'class-validator';
import { CreateProjectTaskDto } from './create-projec_task.dto';

// Omit fields that shouldn't be updated like projectUuid or taskCode
export class UpdateProjectTaskDto extends PartialType(
  OmitType(CreateProjectTaskDto, ['projectUuid', 'taskCode', 'addedBy', 'addedById'] as const)
) {
  @IsString()
  @IsOptional()
  updatedBy?: string;
}