/* eslint-disable prettier/prettier */

import { 
  IsString, 
  IsOptional, 
  IsNumber, 
  IsISO8601,
  Min,
  Max
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePropertyPricingDto {
  @IsString()
  propertyId: string;

  @IsString()
  propertyName: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  basePrice: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  retailPrice: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  investorPrice: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  vipPrice: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  @Type(() => Number)
  taxPercent?: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  @Type(() => Number)
  discountPercent?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  bookingFee?: number;

  @IsISO8601({ strict: true })
  @IsOptional()
  effectiveDate?: string;

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