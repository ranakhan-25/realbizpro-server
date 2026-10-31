/* eslint-disable prettier/prettier */

import { 
  IsString, 
  IsOptional, 
  IsNumberString,
  IsUUID
} from 'class-validator';

export class QueryChartOfAccountDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  under?: string;

  @IsUUID()
  @IsOptional()
  chartOfGroupUuid?: string;

  @IsNumberString()
  @IsOptional()
  page?: string;

  @IsNumberString()
  @IsOptional()
  limit?: string;
}