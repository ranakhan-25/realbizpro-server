/* eslint-disable prettier/prettier */

import { 
  IsString, 
  IsOptional, 
  IsNumberString 
} from 'class-validator';

export class QueryChequeRangeDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  cashBank?: string;

  @IsNumberString()
  @IsOptional()
  page?: string;

  @IsNumberString()
  @IsOptional()
  limit?: string;
}