import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional, IsDateString, IsArray, ValidateNested, IsNumber, ArrayMinSize, IsBoolean } from 'class-validator';

// ==========================================
// DETAILS (Nicher Table)
// ==========================================
export class CreatePaymentVoucherEntryDto {
  @IsString()
  @IsOptional()
  projectId?: string;

  @IsString()
  @IsOptional()
  titleId?: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsNotEmpty()
  debitAccount: string;

  @IsString()
  @IsNotEmpty()
  creditAccount: string;

  @IsNumber()
  @Type(() => Number)
  total: number;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsString()
  @IsOptional()
  cheque?: string;

  @IsString()
  @IsOptional()
  addedBy?: string;

  @IsString()
  @IsOptional()
  editedBy?: string;
}

// ==========================================
// MASTER (Upore Form)
// ==========================================
export class CreatePaymentVoucherDto {
  @IsDateString({}, { message: 'date must be a valid ISO 8601 date string' })
  @IsNotEmpty()
  date: string;

  // Voucher Info
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
  @IsOptional()
  taskId?: string;

  @IsString()
  @IsOptional()
  siteId?: string;

  // Payment Info
  @IsString()
  @IsNotEmpty()
  accountId: string;

  @IsString()
  @IsNotEmpty()
  paymentMethod: string;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  isCheque?: boolean;

  @IsString()
  @IsOptional()
  chequeNo?: string;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsNumber()
  @Type(() => Number)
  amount: number;

  // Additional Fields
  @IsString()
  @IsOptional()
  invoiceId?: string;

  @IsString()
  @IsOptional()
  itemId?: string;

  @IsString()
  @IsOptional()
  attachmentUrl?: string;

  // Details Array
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one entry is required' })
  @ValidateNested({ each: true })
  @Type(() => CreatePaymentVoucherEntryDto)
  entries: CreatePaymentVoucherEntryDto[];
  @ApiPropertyOptional({ example: 'user-uuid' })
  @IsOptional()
  @IsString()
  createdBy?: string;

  @ApiPropertyOptional({ description: 'Organization ID', example: 1 })
  @IsOptional()
  orgId?: number;

}