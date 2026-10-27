/* eslint-disable prettier/prettier */

import { 
  IsString, 
  IsEnum, 
  IsOptional, 
  IsNumber,
  IsISO8601,
  Min
} from 'class-validator';
import { Type } from 'class-transformer';
import { AssetStatus, ComputationType, DepreciationMethod } from 'src/database/models/accounts/assets/assets_list_model';


export class CreateAssetDto {
  @IsString()
  itemName: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsISO8601()
  acquisitionDate: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  originalValue: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  notDepreciableValue?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  bookValue?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  depreciableValue?: number;

  @IsEnum(DepreciationMethod)
  method: DepreciationMethod;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  duration: number;

  @IsEnum(ComputationType)
  computation: ComputationType;

  @IsString()
  @IsOptional()
  project?: string;

  @IsString()
  @IsOptional()
  expenseAccount?: string;

  @IsString()
  @IsOptional()
  voucherNo?: string;

  @IsEnum(AssetStatus)
  @IsOptional()
  status?: AssetStatus;

  @IsString()
  @IsOptional()
  addedBy?: string;

  @IsString()
  @IsOptional()
  addedById?: string;
}