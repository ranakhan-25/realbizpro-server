/* eslint-disable prettier/prettier */

import {
  IsString,
  IsOptional,
  IsNumber,
  IsISO8601,
  IsArray,
  ValidateNested,
  Min,
  IsEnum,
  IsUUID,
  ValidateIf,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { EntryType } from 'src/database/models/accounts/vouchers/acc_journal-voucher-item.model';

/**
 * একটি entry-র ভেতরের আইটেম।
 * Frontend থেকে যা আসবে:
 *  { entryType: "DEBIT"|"CREDIT", accountId: "<uuid>", accountName, debit, credit,
 *    chequeReceiptNo, note }
 */
export class CreateJournalVoucherItemDto {
  // entryType: DR/CR/DEBIT/CREDIT — সব normalize করে EntryType এ convert
  @Transform(({ value, obj }) => {
    const raw = typeof value === 'string' ? value.trim().toUpperCase() : value;
    if (raw === 'DR' || raw === 'DEBIT') return EntryType.DEBIT;
    if (raw === 'CR' || raw === 'CREDIT') return EntryType.CREDIT;
    if (raw) return raw;
    // fallback: debit > 0 → DEBIT, credit > 0 → CREDIT
    if (Number(obj?.debit || 0) > 0) return EntryType.DEBIT;
    if (Number(obj?.credit || 0) > 0) return EntryType.CREDIT;
    return raw;
  })
  @IsEnum(EntryType, {
    message: 'entryType must be one of the following values: DEBIT, CREDIT',
  })
  entryType: EntryType;

  // accountId: alias থেকে map করে string এ convert, তারপর UUID validate
  @Transform(({ value, obj }) => {
    const raw =
      value ??
      obj?.chartOfAccountUuid ??
      obj?.chartOfAccountId ??
      obj?.accountUuid ??
      obj?.coaUuid ??
      obj?.account?.uuid ??
      obj?.account?.id ??
      obj?.chartOfAccount?.uuid ??
      obj?.chartOfAccount?.id;
    return raw === null || raw === undefined ? raw : String(raw).trim();
  })
  @IsUUID('4', { message: 'accountId must be a valid UUID' })
  accountId: string;

  // accountName: alias থেকে map
  @Transform(({ value, obj }) =>
    value ??
    obj?.accountName ??
    obj?.account?.name ??
    obj?.chartOfAccount?.name ??
    obj?.name ??
    '',
  )
  @IsString()
  accountName: string;

  // chartOfAccountUuid optional — backend-এ থাকলে accountId হিসেবে ব্যবহার হবে
  @Transform(({ value }) =>
    value === null || value === undefined ? value : String(value),
  )
  @IsString()
  @IsOptional()
  chartOfAccountUuid?: string;

  @Transform(({ value, obj }) => {
    const amount = value ?? obj?.debitAmount ?? obj?.drAmount;
    if (amount === null || amount === undefined || amount === '') return 0;
    const parsed = Number(String(amount).replace(/,/g, ''));
    return Number.isFinite(parsed) ? parsed : 0;
  })
  @IsNumber()
  @Min(0)
  debit: number;

  @Transform(({ value, obj }) => {
    const amount = value ?? obj?.creditAmount ?? obj?.crAmount;
    if (amount === null || amount === undefined || amount === '') return 0;
    const parsed = Number(String(amount).replace(/,/g, ''));
    return Number.isFinite(parsed) ? parsed : 0;
  })
  @IsNumber()
  @Min(0)
  credit: number;

  @Transform(({ value, obj }) => {
    const v = value ?? obj?.chqReceipt ?? obj?.chequeReceipt;
    return v === null || v === undefined ? v : String(v);
  })
  @IsString()
  @IsOptional()
  chequeReceiptNo?: string;

  // পুরনো field name এখনো accept করবে (whitelist এ রাখার জন্য)
  @IsString()
  @IsOptional()
  chqReceipt?: string;

  @IsString()
  @IsOptional()
  note?: string;

  @ValidateIf((_object, value) => value !== null && value !== undefined)
  @IsString()
  bank_name?: string;
}

export class CreateJournalVoucherDto {
  @IsString()
  voucherNo: string;

  @Transform(({ value }) => {
    if (typeof value !== 'string') return value;
    // DD/MM/YYYY → YYYY-MM-DD
    const match = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    return match
      ? `${match[3]}-${match[2].padStart(2, '0')}-${match[1].padStart(2, '0')}`
      : value;
  })
  @IsISO8601({ strict: true })
  date: string;

  @IsString() @IsOptional() projectType?: string;
  @IsString() @IsOptional() titleOfWork?: string;
  @IsString() @IsOptional() project?: string;
  @IsString() @IsOptional() site?: string;
  @IsString() @IsOptional() task?: string;
  @IsString() @IsOptional() comment?: string;
  @IsString() @IsOptional() attachmentUrl?: string;
  @ValidateIf((_object, value) => value !== null && value !== undefined)
  @IsString()
  bank_name?: string;

  // পুরনো নাম থাকলেও whitelist এ আটকাবে না
  @IsString() @IsOptional() attachmentName?: string;

  // details থাকলে validate হবে কিন্তু business logic-এ items ই ব্যবহার করবেন
  @IsArray() @IsOptional() details?: unknown[];

  @IsNumber() @Min(0) @Type(() => Number) totalDebit: number;
  @IsNumber() @Min(0) @Type(() => Number) totalCredit: number;

  @IsString() @IsOptional() addedBy?: string;
  @IsString() @IsOptional() addedById?: string;

  // ✅ items — আসল ডেটা এখানে
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateJournalVoucherItemDto)
  items: CreateJournalVoucherItemDto[];
}