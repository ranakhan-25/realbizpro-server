// src/vouchers/dto/create-voucher.dto.ts
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString, IsNotEmpty, IsOptional, IsDateString,
  IsArray, ValidateNested, IsNumber, ArrayMinSize
} from 'class-validator';

// ==========================================
// DETAILS (Nicher table er ek row)
// ==========================================
export class CreateVoucherEntryDto {
  @IsString()
  @IsOptional()
  projectId?: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsNotEmpty()
  accountName: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  credit?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  debit?: number;

  @IsNumber()
  @Type(() => Number)
  total: number;

  @IsString()
  @IsOptional()
  ref?: string;

  @IsString()
  @IsOptional()
  chequeReceipt?: string;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsString()
  @IsOptional()
  addedBy?: string;
}

// ==========================================
// MASTER (Upore form + Details Array)
// ==========================================
export class CreateVoucherDto {
  @IsDateString({}, { message: 'date must be a valid ISO 8601 date string' })
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsOptional()
  projectType?: string;

  @IsString()
  @IsOptional()
  projectId?: string;

  @IsString()
  @IsOptional()
  workId?: string;

  @IsString()
  @ApiPropertyOptional({ example: 'default-account' })
  @IsOptional()
  accountId?: string;

  @IsString()
  @ApiPropertyOptional({ example: 'Cash' })
  @IsOptional()
  paymentMethod?: string;

  @IsString()
  @IsOptional()
  chequeNo?: string;

  @IsNumber()
  @Type(() => Number)
  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  amount?: number;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsString()
  @IsOptional()
  attachmentUrl?: string;

  // Ekhane array te nicher table er data ashbe
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one entry is required' })
  @ValidateNested({ each: true })
  @Type(() => CreateVoucherEntryDto)
  entries: CreateVoucherEntryDto[];
}