/* eslint-disable prettier/prettier */

import { IsOptional, IsString, IsNumber, IsEnum } from 'class-validator';
import { FlatLandStatus } from 'src/database/models/projects/flatland/pr_flatland_model';


export class CreateFlatLandDto {
  @IsOptional()
  @IsString()
  uid?: string;

  @IsString()
  projectName: string;

  @IsOptional()
  @IsString()
  siteBlock?: string;

  @IsString()
  flatLandNo: string;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsNumber()
  bedroom?: number;

  @IsOptional()
  @IsNumber()
  bathroom?: number;

  @IsOptional()
  @IsString()
  size?: string;

  @IsOptional()
  @IsNumber()
  pricePerUnit?: number;

  @IsOptional()
  @IsNumber()
  parkingCost?: number;

  @IsOptional()
  @IsNumber()
  utilityCharge?: number;

  @IsOptional()
  @IsString()
  customerName?: string;

  @IsOptional()
  @IsEnum(FlatLandStatus)
  status?: FlatLandStatus;
}