/* eslint-disable prettier/prettier */

import { IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateFloorDto {
  @IsOptional()
  @IsString()
  uid?: string;

  @IsString()
  buildingUuid: string;

  @IsString()
  floorCode: string;

  @IsString()
  floorName: string;

  @IsNumber()
  floorNumber: number;

  @IsOptional()
  @IsNumber()
  unitsCount?: number;

  @IsOptional()
  @IsString()
  addedBy?: string;
}