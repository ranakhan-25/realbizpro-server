/* eslint-disable prettier/prettier */
import { IsString, IsNumber, IsOptional, IsISO8601, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCancellationDto {
  @IsString() cancellationId: string;
  @IsString() @IsOptional() status?: string;

  @IsISO8601({ strict: true }) cancellationDate: string;
  @IsString() @IsOptional() processedBy?: string;
  @IsString() reason: string;
  @IsString() @IsOptional() notes?: string;

  // Financials
  @IsNumber() @Min(0) @Type(() => Number) totalPaid: number;
  @IsNumber() @Min(0) @Type(() => Number) cancellationFee: number;
  @IsNumber() @Min(0) @Type(() => Number) refundAmount: number;
  @IsString() @IsOptional() refundMethod?: string;
  @IsString() @IsOptional() refundTxnId?: string;
  @IsISO8601({ strict: true }) @IsOptional() refundDate?: string;
  @IsString() @IsOptional() refundStatus?: string;

  // Property Snapshot
  @IsString() propertyName: string;
  @IsString() @IsOptional() propertyCode?: string;
  @IsString() @IsOptional() propertyType?: string;
  @IsString() @IsOptional() propertyArea?: string;
  @IsString() @IsOptional() propertyImage?: string;
  @IsString() @IsOptional() propertyLocation?: string;

  // Buyer Snapshot
  @IsString() buyerName: string;
  @IsString() @IsOptional() buyerEmail?: string;
  @IsString() @IsOptional() buyerPhone?: string;
  @IsString() @IsOptional() buyerAvatar?: string;
  @IsString() @IsOptional() buyerNid?: string;
}