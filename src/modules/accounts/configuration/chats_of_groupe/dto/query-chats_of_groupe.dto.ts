/* eslint-disable prettier/prettier */

import { 
  IsString, 
  IsOptional, 
  IsNumberString 
} from 'class-validator';

export class QueryChartOfGroupDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  under?: string;

  @IsString()
  @IsOptional()
  chartOfSection?: string;

  @IsNumberString()
  @IsOptional()
  page?: string;

  @IsNumberString()
  @IsOptional()
  limit?: string;
}