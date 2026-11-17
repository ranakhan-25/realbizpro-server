import { ApiPropertyOptional } from '@nestjs/swagger';
/* eslint-disable prettier/prettier */

import { IsString, IsEnum, IsOptional, IsNumber, IsISO8601, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ReconciliationStatus } from '../../../../../database/models/accounts/bank-reconciliation/acc_bank-reconciliation.model';

export class CreateBankReconciliationDto {
  @IsString()
  voucherNo: string;

  @IsString()
  description: string;

  // ✅ এখানে Transform যোগ করুন — bank_name বা bankName এলেও bank-এ map হবে
  @Transform(({ value, obj }) => value ?? obj?.bank_name ?? obj?.bankName)
  @IsString()
  bank: string;

  @IsISO8601({ strict: true })
  date: string;

  @IsISO8601({ strict: true })
  @IsOptional()
  chequeDate?: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  amount: number;

  @IsString()
  @IsOptional()
  note?: string;

  @IsEnum(ReconciliationStatus)
  @IsOptional()
  status?: ReconciliationStatus;

  @IsString()
  @IsOptional()
  addedBy?: string;

  @IsString()
  @IsOptional()
  addedById?: string;

  // ✅ whitelist এ আটকাবে না — এই লাইনটা যোগ করুন
  @IsString()
  @IsOptional()
  bank_name?: string;
  @ApiPropertyOptional({ example: 'user-uuid' })
  @IsOptional()
  @IsString()
  createdBy?: string;

  @ApiPropertyOptional({ description: 'Organization ID', example: 1 })
  @IsOptional()
  orgId?: number;

  @ApiPropertyOptional({ description: 'Project UUID or ID' })
  @IsOptional()
  @IsString()
  projectId?: string;

}