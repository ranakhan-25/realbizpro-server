/* eslint-disable prettier/prettier */

import { 
  IsString, 
  IsOptional, 
  IsNumber,
  IsISO8601,
  IsArray,
  ValidateNested,
  Min
} from 'class-validator';
import { Type } from 'class-transformer';

class CreateExpenseItemDto {
  @IsString()
  accountId: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsString()
  @IsOptional()
  note?: string;
}

export class CreateExpenseDto {
  @IsString() @IsOptional() projectType?: string;
  @IsString() @IsOptional() project?: string;
  @IsString() @IsOptional() titleOfWork?: string;
  @IsString() @IsOptional() task?: string;
  @IsString() @IsOptional() site?: string;

  @IsISO8601({ strict: true })
  date: string;

  @IsString()
  @IsOptional()
  voucherNo?: string;

  @IsString() @IsOptional() contact?: string;
  @IsString() @IsOptional() cashOrBank?: string;
  @IsString() @IsOptional() chequeNo?: string;
  @IsString() @IsOptional() comment?: string;
  @IsString() @IsOptional() attachmentUrl?: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  totalAmount: number;

  // ✅ নেস্টেড আইটেম অ্যারে
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateExpenseItemDto)
  items: CreateExpenseItemDto[];

  @IsString() @IsOptional() addedBy?: string;
  @IsString() @IsOptional() addedById?: string;
}