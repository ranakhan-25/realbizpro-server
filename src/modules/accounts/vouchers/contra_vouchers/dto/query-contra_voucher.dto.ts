import { ApiPropertyOptional } from '@nestjs/swagger';
/* eslint-disable prettier/prettier */

import { IsString, IsOptional, IsNumberString, IsISO8601 } from 'class-validator';

export class QueryContraVoucherDto {
  @IsString() @IsOptional() search?: string;
  @IsString() @IsOptional() project?: string;
  @IsString() @IsOptional() titleOfWork?: string;
  @IsString() @IsOptional() site?: string;
  @IsString() @IsOptional() task?: string;
  @IsString() @IsOptional() accountId?: string; // Filter by Debit/Credit Account

  @IsISO8601({ strict: true }) @IsOptional() fromDate?: string;
  @IsISO8601({ strict: true }) @IsOptional() toDate?: string;

  @IsNumberString() @IsOptional() page?: string;
  @IsNumberString() @IsOptional() limit?: string;
  @ApiPropertyOptional({ description: 'Organization ID', example: 1 })
  @IsOptional()
  orgId?: number;

  @ApiPropertyOptional({ description: 'Project UUID or ID' })
  @IsOptional()
  @IsString()
  projectId?: string;

}