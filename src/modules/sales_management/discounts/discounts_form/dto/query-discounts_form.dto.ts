/* eslint-disable prettier/prettier */

import { 
  IsString, 
  IsOptional, 
  IsNumberString,
  IsEnum 
} from 'class-validator';
import { DiscountType } from 'src/database/models/sales_management/sm_discount.model';


export class QueryDiscountDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  propertyId?: string;

  @IsEnum(DiscountType)
  @IsOptional()
  discountType?: DiscountType;

  @IsNumberString()
  @IsOptional()
  page?: string;

  @IsNumberString()
  @IsOptional()
  limit?: string;
}