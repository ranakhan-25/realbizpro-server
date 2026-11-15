import { ApiPropertyOptional } from '@nestjs/swagger';
/* eslint-disable prettier/prettier */

import { IsString, IsEnum, IsOptional, IsNumberString, IsISO8601 } from 'class-validator';
import { ReconciliationStatus } from '../../../../../database/models/accounts/bank-reconciliation/acc_bank-reconciliation.model';

export class QueryBankReconciliationDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  bank?: string;

  @IsString()
  @IsOptional()
  type?: string; // Deposit / Withdrawal

  @IsEnum(ReconciliationStatus)
  @IsOptional()
  status?: ReconciliationStatus;

  @IsISO8601({ strict: true })
  @IsOptional()
  fromDate?: string;

  @IsISO8601({ strict: true })
  @IsOptional()
  toDate?: string;

  @IsNumberString()
  @IsOptional()
  page?: string;

  @IsNumberString()
  @IsOptional()
  limit?: string;
  @ApiPropertyOptional({ description: 'Organization ID', example: 1 })
  @IsOptional()
  orgId?: number;

  @ApiPropertyOptional({ description: 'Project UUID or ID' })
  @IsOptional()
  @IsString()
  projectId?: string;

}