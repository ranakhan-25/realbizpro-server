import { ApiPropertyOptional } from '@nestjs/swagger';
/* eslint-disable prettier/prettier */

import { IsString, IsEnum, IsOptional, IsNumberString, IsISO8601 } from 'class-validator';
import { RowType } from 'src/database/models/accounts/reports/acc_balance-summury_list_model';

export class QueryBalanceSheetDto {
  @IsString()
  @IsOptional()
  company?: string;

  @IsISO8601({ strict: true })
  @IsOptional()
  asOfDate?: string;

  @IsString()
  @IsOptional()
  search?: string;

  @IsEnum(RowType)
  @IsOptional()
  type?: RowType;

  @IsNumberString()
  @IsOptional()
  page?: string;

  @IsNumberString()
  @IsOptional()
  limit?: string;
  @ApiPropertyOptional({ description: 'Organization ID', example: 1 })
  @IsOptional()
  orgId?: number;

  @ApiPropertyOptional({ description: 'Project UUID or ID' })
  @IsOptional()
  @IsString()
  projectId?: string;

}