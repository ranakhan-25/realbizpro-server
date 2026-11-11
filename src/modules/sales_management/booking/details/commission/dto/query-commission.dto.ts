/* eslint-disable prettier/prettier */
import { IsString, IsOptional } from 'class-validator';

export class QueryCommissionDto {
  @IsString() @IsOptional() search?: string;
  @IsString() @IsOptional() status?: string;
}