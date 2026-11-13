/* eslint-disable prettier/prettier */
import { IsString, IsOptional } from 'class-validator';

export class QueryAgreementDto {
  @IsString()
  @IsOptional()
  search?: string;
}