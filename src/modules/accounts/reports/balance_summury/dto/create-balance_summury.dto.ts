/* eslint-disable prettier/prettier */

import { 
  IsString, 
  IsEnum, 
  IsOptional, 
  IsNumber,
  IsISO8601,
  Min
} from 'class-validator';
import { Type } from 'class-transformer';
import { RowType } from 'src/database/models/accounts/reports/acc_balance-summury_list_model';

export class CreateBalanceSheetDto {
  @IsString()
  company: string;

  @IsISO8601({ strict: true })
  asOfDate: string;

  @IsString()
  particulars: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  balance: number;

  @IsEnum(RowType)
  type: RowType;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  indent?: number;

  @IsString()
  @IsOptional()
  addedBy?: string;

  @IsString()
  @IsOptional()
  addedById?: string;
}