/* eslint-disable prettier/prettier */

import { 
  IsString, 
  IsOptional, 
  IsNumberString,
  IsISO8601,
  IsEnum
} from 'class-validator';


export class QueryJournalVoucherDto {
  @IsString() @IsOptional() search?: string;
  @IsString() @IsOptional() project?: string;
  @IsString() @IsOptional() titleOfWork?: string;
  @IsString() @IsOptional() site?: string;
  @IsString() @IsOptional() task?: string;
  @IsString() @IsOptional() accountId?: string; // Debit/Credit Account Filter

  @IsISO8601({ strict: true }) @IsOptional() fromDate?: string;
  @IsISO8601({ strict: true }) @IsOptional() toDate?: string;

  @IsNumberString() @IsOptional() page?: string;
  @IsNumberString() @IsOptional() limit?: string;
}