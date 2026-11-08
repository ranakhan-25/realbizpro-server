import { ApiPropertyOptional } from '@nestjs/swagger';
/* eslint-disable prettier/prettier */

import { IsString, IsOptional, IsNumber, IsEnum, IsISO8601, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ChequeStatus } from '../../../../../database/models/accounts/bank-reconciliation/acc_cheque.model';

export class CreateChequeDto {
  @IsString()
  chequeRangeUuid: string;

  @IsString()
  instrumentNumber: string;

  @IsEnum(ChequeStatus)
  @IsOptional()
  chequeStatus?: ChequeStatus;

  @IsISO8601({ strict: true })
  @IsOptional()
  instrumentDate?: string;

  @IsString()
  @IsOptional()
  favouringName?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  amount?: number;

  @IsString()
  @IsOptional()
  addedBy?: string;

  @IsString()
  @IsOptional()
  addedById?: string;
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