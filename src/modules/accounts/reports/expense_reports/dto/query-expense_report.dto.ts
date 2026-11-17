import { ApiPropertyOptional } from '@nestjs/swagger';
/* eslint-disable prettier/prettier */

import { IsString, IsOptional, IsNumberString } from 'class-validator';

export class QueryExpenseReportDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  company?: string;

  @IsString()
  @IsOptional()
  project?: string;

  @IsString()
  @IsOptional()
  site?: string;

  @IsString()
  @IsOptional()
  task?: string;

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