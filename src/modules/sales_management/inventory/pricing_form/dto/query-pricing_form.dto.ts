/* eslint-disable prettier/prettier */

import { 
  IsString, 
  IsOptional, 
  IsNumberString,
} from 'class-validator';

export class QueryPropertyPricingDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  propertyId?: string;

  @IsNumberString()
  @IsOptional()
  page?: string;

  @IsNumberString()
  @IsOptional()
  limit?: string;
}