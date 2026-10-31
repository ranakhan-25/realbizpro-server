/* eslint-disable prettier/prettier */

import { 
  IsString, 
  IsOptional, 
  IsBoolean
} from 'class-validator';

export class CreateChartOfGroupDto {
  @IsString()
  code: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  reportSection?: string;

  @IsString()
  under: string;

  @IsString()
  chartOfSection: string;

  @IsBoolean()
  @IsOptional()
  hasDelete?: boolean;

  @IsString()
  @IsOptional()
  addedBy?: string;

  @IsString()
  @IsOptional()
  addedById?: string;
}