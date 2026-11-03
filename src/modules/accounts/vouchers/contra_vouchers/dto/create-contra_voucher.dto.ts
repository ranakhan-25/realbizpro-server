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
  ValidateIf,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { EntryType } from 'src/database/models/accounts/vouchers/acc_journal-voucher-item.model';


class CreateContraVoucherItemDto {
  @Transform(({ value, obj }) => {
    if (!value && Number(obj?.debit || 0) > 0) return EntryType.DEBIT;
    if (!value && Number(obj?.credit || 0) > 0) return EntryType.CREDIT;
    if (typeof value !== 'string') return value;
    const normalized = value.trim().toUpperCase();
    if (normalized === 'DR' || normalized === 'DEBIT') return EntryType.DEBIT;
    if (normalized === 'CR' || normalized === 'CREDIT') return EntryType.CREDIT;
    return normalized;
  })
  @IsEnum(EntryType)
  entryType?: EntryType;

  @Transform(({ value, obj }) => {
    const accountId =
      value ??
      obj.chartOfAccountUuid ??
      obj.chartOfAccountId ??
      obj.accountUuid ??
      obj.coaUuid ??
      obj.account?.uuid ??
      obj.account?.id ??
      obj.chartOfAccount?.uuid ??
      obj.chartOfAccount?.id ??
      obj.id;
    return accountId === null || accountId === undefined ? accountId : String(accountId);
  })
  @IsString()
  accountId: string;

  @Transform(({ value, obj }) =>
    value ?? obj.accountName ?? obj.account?.name ?? obj.chartOfAccount?.name ?? obj.name ?? '',
  )
  @IsString()
  accountName: string;

  @Transform(({ value, obj }) => value ?? obj.accountId)
  @IsString()
  @IsOptional()
  chartOfAccountUuid?: string;

  @Transform(({ value, obj }) => {
    const amount = value ?? obj.debitAmount ?? obj.drAmount;
    return amount === null || amount === undefined || amount === '' ? 0 : Number(String(amount).replace(/,/g, ''));
  })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  debit: number;

  @Transform(({ value, obj }) => {
    const amount = value ?? obj.creditAmount ?? obj.crAmount;
    return amount === null || amount === undefined || amount === '' ? 0 : Number(String(amount).replace(/,/g, ''));
  })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  credit: number;

  @IsString()
  @IsOptional()
  chequeReceiptNo?: string;

  @Transform(({ value, obj }) => value ?? obj.chqReceipt)
  @IsString()
  @IsOptional()
  chqReceipt?: string;

  @IsString()
  @IsOptional()
  note?: string;

}

export class CreateContraVoucherDto {
  @IsString()
  voucherNo: string;

  @Transform(({ value }) => {
    if (typeof value !== 'string') return value;
    const match = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    return match ? `${match[3]}-${match[2].padStart(2, '0')}-${match[1].padStart(2, '0')}` : value;
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
  @IsOptional()
  attachmentName?: string;
  @IsArray()
  @IsOptional()
  details?: unknown[];

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  totalDebit: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  totalCredit: number;

  @IsString() @IsOptional() addedBy?: string;
  @IsString() @IsOptional() addedById?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateContraVoucherItemDto)
  items: CreateContraVoucherItemDto[];
}