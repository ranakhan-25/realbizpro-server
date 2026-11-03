/* eslint-disable prettier/prettier */

import { PartialType } from '@nestjs/mapped-types';
import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateJournalVoucherDto, CreateJournalVoucherItemDto } from './create-journal_voucher.dto';


/**
 * Update DTO — সব ফিল্ড optional (PartialType)।
 * অতিরিক্ত: updatedBy / updatedById
 */
export class UpdateJournalVoucherDto extends PartialType(
  CreateJournalVoucherDto,
) {
  @IsString()
  @IsOptional()
  updatedBy?: string;

  @IsString()
  @IsOptional()
  updatedById?: string;

  // items override — যাতে nested validation সঠিক থাকে
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateJournalVoucherItemDto)
  override items?: CreateJournalVoucherItemDto[];
}