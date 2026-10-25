/* eslint-disable prettier/prettier */

import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateUnitPlotDto } from './create-unit_plot.dto';
import { IsString, IsOptional } from 'class-validator';

export class UpdateUnitPlotDto extends PartialType(
  OmitType(CreateUnitPlotDto, ['floorUuid', 'addedBy', 'addedById'] as const)
) {
  @IsString()
  @IsOptional()
  updatedBy?: string;
}