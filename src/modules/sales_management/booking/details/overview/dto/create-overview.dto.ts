/* eslint-disable prettier/prettier */
import { IsString, IsNumber, IsOptional, IsISO8601, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOverviewDto {
  // Property
  @IsString() propertyName: string;
  @IsString() @IsOptional() propertyCode?: string;
  @IsString() @IsOptional() propertyType?: string;
  @IsString() @IsOptional() propertyArea?: string;
  @IsNumber() @Min(0) @Type(() => Number) propertyPrice: number;
  @IsString() @IsOptional() propertyLocation?: string;
  @IsString() @IsOptional() propertyImage?: string;

  // Buyer
  @IsString() buyerName: string;
  @IsString() @IsOptional() buyerEmail?: string;
  @IsString() @IsOptional() buyerPhone?: string;
  @IsString() @IsOptional() buyerAvatar?: string;
  @IsString() @IsOptional() buyerNid?: string;

  // Financials
  @IsNumber() @Min(0) @Type(() => Number) totalPrice: number;
  @IsNumber() @Min(0) @Type(() => Number) amountPaid: number;
  @IsNumber() @Min(0) @Type(() => Number) remainingDue: number;
  @IsISO8601({ strict: true }) @IsOptional() nextDueDate?: string;
}