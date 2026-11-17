/* eslint-disable prettier/prettier */
import { IsString, IsOptional, IsISO8601, IsArray, ValidateNested, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class ChecklistItemDto {
  @IsString() label: string;
  @IsBoolean() done: boolean;
}

export class CreateHandoverDto {
  @IsString() handoverId: string;
  @IsString() @IsOptional() status?: string;

  @IsISO8601({ strict: true }) handoverDate: string;
  @IsString() @IsOptional() handoverTime?: string;

  // Utilities
  @IsString() @IsOptional() electricityReading?: string;
  @IsString() @IsOptional() waterReading?: string;
  @IsString() @IsOptional() gasReading?: string;

  // Checklist
  @IsArray() @IsOptional() @ValidateNested({ each: true }) @Type(() => ChecklistItemDto)
  checklist?: ChecklistItemDto[];

  // Property Snapshot
  @IsString() propertyName: string;
  @IsString() @IsOptional() propertyCode?: string;
  @IsString() @IsOptional() propertyImage?: string;
  @IsString() @IsOptional() propertyLocation?: string;

  // Buyer Snapshot
  @IsString() buyerName: string;
  @IsString() @IsOptional() buyerAvatar?: string;
  @IsString() @IsOptional() buyerPhone?: string;
}