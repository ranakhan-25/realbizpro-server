import { ApiPropertyOptional } from '@nestjs/swagger';
/* eslint-disable prettier/prettier */

import { IsString, IsOptional, IsBoolean } from 'class-validator';

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
  @ApiPropertyOptional({ example: 'user-uuid' })
  @IsOptional()
  @IsString()
  createdBy?: string;

  @ApiPropertyOptional({ description: 'Organization ID', example: 1 })
  @IsOptional()
  orgId?: number;

  @ApiPropertyOptional({ description: 'Project UUID or ID' })
  @IsOptional()
  @IsString()
  projectId?: string;

}