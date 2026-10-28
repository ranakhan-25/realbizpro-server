/* eslint-disable prettier/prettier */

import { PartialType } from '@nestjs/mapped-types';
import { CreateExpenseReportDto } from './create-expense_report.dto';
import { IsString, IsOptional } from 'class-validator';

export class UpdateExpenseReportDto extends PartialType(CreateExpenseReportDto) {
  @IsString()
  @IsOptional()
  updatedBy?: string;
}