/* eslint-disable prettier/prettier */

import { 
  IsString, 
  IsOptional, 
  IsNumberString,
  IsEnum 
} from 'class-validator';
import { HoldStatus } from '../../../../../database/models/sales_management/sm_hold-property.model';

export class QueryHoldPropertyDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  propertyId?: string;

  @IsEnum(HoldStatus)
  @IsOptional()
  status?: HoldStatus;

  @IsNumberString()
  @IsOptional()
  page?: string;

  @IsNumberString()
  @IsOptional()
  limit?: string;
}