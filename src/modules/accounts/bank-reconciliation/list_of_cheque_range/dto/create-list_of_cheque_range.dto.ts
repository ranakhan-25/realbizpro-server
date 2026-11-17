import { ApiPropertyOptional } from '@nestjs/swagger';
/* eslint-disable prettier/prettier */

import { IsString, IsOptional, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateChequeRangeDto {
  @IsString()
  cashBank: string;

  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  fromNumber: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  toNumber: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  numberOfCheque: number;

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