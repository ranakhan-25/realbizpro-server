/* eslint-disable prettier/prettier */

import { PartialType, OmitType } from '@nestjs/mapped-types';

import { IsString, IsOptional } from 'class-validator';
import { CreateProjectProgressDto } from './create-project_progress.dto';

export class UpdateProjectProgressDto extends PartialType(
  OmitType(CreateProjectProgressDto, ['projectUuid', 'loggedBy', 'loggedById', 'createdBy'] as const)
) {
  @IsString()
  @IsOptional()
  updatedBy?: string;
}