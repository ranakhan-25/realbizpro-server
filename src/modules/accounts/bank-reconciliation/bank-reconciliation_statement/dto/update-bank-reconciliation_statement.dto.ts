/* eslint-disable prettier/prettier */

import { PartialType } from '@nestjs/mapped-types';
import { CreateBankReconciliationDto } from './create-bank-reconciliation_statement.dto';
import { IsString, IsOptional } from 'class-validator';

export class UpdateBankReconciliationDto extends PartialType(CreateBankReconciliationDto) {
  @IsString()
  @IsOptional()
  updatedBy?: string;

}