/* eslint-disable prettier/prettier */
import { IsString, IsNumber, IsOptional, IsISO8601, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRegistrationDto {
  @IsString() registrationId: string;
  @IsString() @IsOptional() status?: string;

  @IsString() deedNo: string;
  @IsISO8601({ strict: true }) registrationDate: string;
  @IsString() subRegistry: string;

  // Financials
  @IsNumber() @Min(0) @Type(() => Number) propertyValue: number;
  @IsNumber() @Min(0) @Type(() => Number) stampDuty: number;
  @IsNumber() @Min(0) @Type(() => Number) registrationFee: number;
  @IsNumber() @Min(0) @Type(() => Number) totalPaid: number;

  // Mutation
  @IsString() @IsOptional() mutationStatus?: string;
  @IsString() @IsOptional() mutationKhatiyanNo?: string;
  @IsISO8601({ strict: true }) @IsOptional() mutationUpdatedDate?: string;

  // Property Snapshot
  @IsString() propertyName: string;
  @IsString() @IsOptional() propertyCode?: string;
  @IsString() @IsOptional() propertyType?: string;
  @IsString() @IsOptional() propertyArea?: string;
  @IsString() @IsOptional() propertyImage?: string;
  @IsString() @IsOptional() propertyLocation?: string;

  // Buyer Snapshot
  @IsString() buyerName: string;
  @IsString() @IsOptional() buyerNid?: string;

  // Seller Snapshot
  @IsString() sellerName: string;
  @IsString() @IsOptional() sellerRep?: string;
}