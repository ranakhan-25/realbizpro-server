/* eslint-disable prettier/prettier */

import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateBuildingDto {
  @IsOptional()
  @IsString()
  uid?: string;

  @IsOptional()
  @IsString()
  buildingCode?: string;

  @IsString()
  buildingName: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  floorsCount?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  unitsCount?: number;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  siteUid?: string;

  @IsOptional()
  @IsString()
  siteUuid?: string;

  @IsOptional()
  @IsString()
  addedBy?: string;
}
