import { ApiPropertyOptional } from '@nestjs/swagger';
/* eslint-disable prettier/prettier */

import { IsString, IsOptional, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePayableReportDto {
  @IsString()
  supplierName: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  openingBalance: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  debit: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  credit: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  balance: number;

  @IsString()
  @IsOptional()
  project?: string;

  @IsString()
  @IsOptional()
  company?: string;

  @IsString()
  @IsOptional()
  contactType?: string;

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