/* eslint-disable prettier/prettier */

import { PartialType } from '@nestjs/mapped-types';

import { IsString, IsOptional } from 'class-validator';
import { CreateAssetDto } from './create-assets_list.dto';

export class UpdateAssetDto extends PartialType(CreateAssetDto) {
  @IsString()
  @IsOptional()
  updatedBy?: string;
}