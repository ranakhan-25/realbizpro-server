/* eslint-disable prettier/prettier */

import { 
  IsString, 
  IsUUID, 
  IsEnum, 
  IsOptional, 
  IsNumberString 
} from 'class-validator';
import {
  PlotType,
  PlotFacing,
  PlotStatus,
} from 'src/database/models/projects/unit_plot/pr_unit_plot_model';

export class QueryUnitPlotDto {
  @IsUUID()
  @IsOptional()
  floorUuid?: string;

  @IsEnum(PlotType)
  @IsOptional()
  plotType?: PlotType;

  @IsEnum(PlotStatus)
  @IsOptional()
  status?: PlotStatus;

  @IsEnum(PlotFacing)
  @IsOptional()
  facing?: PlotFacing;

  @IsString()
  @IsOptional()
  search?: string;

  @IsNumberString()
  @IsOptional()
  page?: string;

  @IsNumberString()
  @IsOptional()
  limit?: string;
}