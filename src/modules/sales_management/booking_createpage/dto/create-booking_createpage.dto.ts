/* eslint-disable prettier/prettier */

import { 
  IsString, 
  IsOptional, 
  IsNumber, 
  IsEmail, 
  IsISO8601, 
  IsArray,
  Min
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBookingDto {
  // Buyer Info
  @IsString()
  buyerName: string;

  @IsEmail()
  buyerEmail: string;

  @IsString()
  buyerPhone: string;

  @IsString()
  @IsOptional()
  buyerNid?: string;

  // Property Info
  @IsString()
  propertyId: string;

  @IsString()
  propertyName: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  propertyPrice: number;

  // Schedule
  @IsISO8601({ strict: true })
  visitDate: string;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;

  @IsString()
  @IsOptional()
  agentId?: string;

  @IsString()
  @IsOptional()
  agentName?: string;

  // Location
  @IsString()
  @IsOptional()
  area?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  country?: string;

  // Addons
  @IsArray()
  @IsOptional()
  selectedAddons?: { id: string; name: string; price: number }[];

  // Payment
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  subtotal: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  tax: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  discount?: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  totalAmount: number;

  @IsString()
  paymentMethod: string;

  // Other
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