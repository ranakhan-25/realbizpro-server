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
import {
  PlotType,
  PlotFacing,
  PlotStatus,
} from 'src/database/models/projects/unit_plot/pr_unit_plot_model';

export class CreateUnitPlotDto {
  @IsUUID()
  floorUuid: string;

  @IsString()
  plotCode: string;

  @IsEnum(PlotType)
  plotType: PlotType;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  sizeSqft: number;

  @IsEnum(PlotFacing)
  facing: PlotFacing;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  basePrice: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  floorRise?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  premium?: number;

  @IsString()
  @IsOptional()
  amenities?: string;

  @IsEnum(PlotStatus)
  @IsOptional()
  status?: PlotStatus;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  addedBy?: string;

  @IsString()
  @IsOptional()
  addedById?: string;
}