

/* eslint-disable prettier/prettier */

import { 
  IsString, 
  IsEnum, 
  IsOptional, 
  IsNumberString,
  IsIn
} from 'class-validator';
import { AssetStatus } from 'src/database/models/accounts/assets/assets_list_model';


export class QueryAssetDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsEnum(AssetStatus)
  @IsOptional()
  status?: AssetStatus;

  @IsString()
  @IsOptional()
  project?: string;

  @IsIn(['itemName', 'acquisitionDate', 'originalValue', 'bookValue', 'status', 'createdAt'])
  @IsOptional()
  sortBy?: string = 'createdAt';

  @IsIn(['ASC', 'DESC'])
  @IsOptional()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';

  @IsNumberString()
  @IsOptional()
  page?: string;

  @IsNumberString()
  @IsOptional()
  limit?: string;
}