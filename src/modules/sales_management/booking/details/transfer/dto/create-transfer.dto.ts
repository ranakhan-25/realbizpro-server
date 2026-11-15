/* eslint-disable prettier/prettier */
import { IsString, IsOptional, IsISO8601 } from 'class-validator';

export class CreateTransferDto {
  @IsString() transferId: string;
  @IsString() @IsOptional() status?: string;

  @IsISO8601({ strict: true }) transferDate: string;
  @IsString() reason: string;

  // Property Snapshot
  @IsString() propertyName: string;
  @IsString() @IsOptional() propertyCode?: string;
  @IsString() @IsOptional() propertyImage?: string;
  @IsString() @IsOptional() propertyLocation?: string;

  // From Buyer Snapshot
  @IsString() fromBuyerName: string;
  @IsString() @IsOptional() fromBuyerNid?: string;

  // To Buyer Snapshot
  @IsString() toBuyerName: string;
  @IsString() @IsOptional() toBuyerNid?: string;
  @IsString() @IsOptional() toBuyerPhone?: string;
}