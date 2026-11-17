/* eslint-disable prettier/prettier */

import { 
  IsString, 
  IsOptional, 
  IsNumber, 
  IsEnum, 
  IsISO8601,
  Min
} from 'class-validator';
import { Type } from 'class-transformer';
import { DiscountType } from 'src/database/models/sales_management/sm_discount.model';


export class CreateDiscountDto {
  @IsString()
  propertyId: string;

  @IsString()
  propertyName: string;

  @IsEnum(DiscountType)
  discountType: DiscountType;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  discountValue: number;

  @IsString()
  reason: string;

  @IsString()
  @IsOptional()
  audience?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  maxUses?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  minPurchase?: number;

  @IsISO8601({ strict: true })
  startDate: string;

  @IsISO8601({ strict: true })
  endDate: string;

  @IsString()
  @IsOptional()
  couponCode?: string;

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