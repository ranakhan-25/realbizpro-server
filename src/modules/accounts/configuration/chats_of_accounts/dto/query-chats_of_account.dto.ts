import { ApiPropertyOptional } from '@nestjs/swagger';
/* eslint-disable prettier/prettier */

import { IsString, IsOptional, IsNumberString, IsUUID } from 'class-validator';

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
  @ApiPropertyOptional({ description: 'Organization ID', example: 1 })
  @IsOptional()
  orgId?: number;

  @ApiPropertyOptional({ description: 'Project UUID or ID' })
  @IsOptional()
  @IsString()
  projectId?: string;

}