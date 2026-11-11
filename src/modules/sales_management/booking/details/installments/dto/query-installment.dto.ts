/* eslint-disable prettier/prettier */
import { IsString, IsOptional, IsNumberString } from 'class-validator';

export class QueryInstallmentDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsNumberString()
  @IsOptional()
  page?: string;

  @IsNumberString()
  @IsOptional()
  limit?: string;
}