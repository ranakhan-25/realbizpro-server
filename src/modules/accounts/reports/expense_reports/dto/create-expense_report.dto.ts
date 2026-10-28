/* eslint-disable prettier/prettier */

import { 
  IsString, 
  IsOptional, 
  IsNumber,
  IsISO8601,
  Min
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateExpenseReportDto {
  @IsISO8601({ strict: true })
  date: string;

  @IsString()
  voucher: string;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  note?: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  amount: number;

  @IsString()
  @IsOptional()
  company?: string;

  @IsString()
  @IsOptional()
  project?: string;

  @IsString()
  @IsOptional()
  site?: string;

  @IsString()
  @IsOptional()
  task?: string;

  @IsString()
  @IsOptional()
  addedBy?: string;

  @IsString()
  @IsOptional()
  addedById?: string;
}