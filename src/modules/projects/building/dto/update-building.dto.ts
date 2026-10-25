/* eslint-disable prettier/prettier */

import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';

import { CreateBuildingDto } from './create-building.dto';

export class UpdateBuildingDto extends PartialType(
  OmitType(CreateBuildingDto, ['addedBy'] as const),
) {
  @IsOptional()
  @IsString()
  updatedBy?: string;
}
