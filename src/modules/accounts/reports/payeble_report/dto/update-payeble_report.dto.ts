/* eslint-disable prettier/prettier */

import { PartialType } from '@nestjs/mapped-types';

import { IsString, IsOptional } from 'class-validator';
import { CreatePayableReportDto } from './create-payeble_report.dto';

export class UpdatePayableReportDto extends PartialType(CreatePayableReportDto) {
  @IsString()
  @IsOptional()
  updatedBy?: string;
}