/* eslint-disable prettier/prettier */

import { PartialType, OmitType } from '@nestjs/mapped-types';

import { IsString, IsOptional } from 'class-validator';
import { CreateProjectControlDto } from './create-project_control.dto';

export class UpdateProjectControlDto extends PartialType(
  OmitType(CreateProjectControlDto, ['projectUuid', 'controlCode', 'addedBy', 'addedById'] as const)
) {
  @IsString()
  @IsOptional()
  updatedBy?: string;
}