import { ApiPropertyOptional } from '@nestjs/swagger';
/* eslint-disable prettier/prettier */

import { IsString, IsOptional, IsNumberString } from 'class-validator';

export class QueryItemEntryDto {
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
  @ApiPropertyOptional({ description: 'Organization ID', example: 1 })
  @IsOptional()
  orgId?: number;

  @ApiPropertyOptional({ description: 'Project UUID or ID' })
  @IsOptional()
  @IsString()
  projectId?: string;

}