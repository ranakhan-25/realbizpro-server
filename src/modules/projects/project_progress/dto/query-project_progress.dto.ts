/* eslint-disable prettier/prettier */

import { IsString, IsUUID, IsOptional, IsNumberString, IsDateString } from 'class-validator';

export class QueryProjectProgressDto {
  @IsUUID()
  @IsOptional()
  projectUuid?: string;

  @IsString()
  @IsOptional()
  search?: string; // Search in remarks or loggedBy

  @IsDateString()
  @IsOptional()
  fromDate?: string;

  @IsDateString()
  @IsOptional()
  toDate?: string;

  @IsNumberString()
  @IsOptional()
  page?: string;

  @IsNumberString()
  @IsOptional()
  limit?: string;
}