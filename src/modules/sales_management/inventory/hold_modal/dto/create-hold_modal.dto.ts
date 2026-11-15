/* eslint-disable prettier/prettier */

import { 
  IsString, 
  IsOptional, 
  IsNumber, 
  IsEmail, 
  IsISO8601,
  Min
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateHoldPropertyDto {
  @IsString()
  propertyId: string;

  @IsString()
  propertyName: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  propertyPrice: number;

  @IsISO8601({ strict: true })
  holdUntil: string;

  @IsString()
  reason: string;

  @IsString()
  branch: string;

  @IsString()
  @IsOptional()
  buyerName?: string;

  @IsEmail()
  @IsOptional()
  buyerEmail?: string;

  @IsString()
  @IsOptional()
  buyerPhone?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  tokenAmount?: number;

  @IsString()
  @IsOptional()
  reference?: string;

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