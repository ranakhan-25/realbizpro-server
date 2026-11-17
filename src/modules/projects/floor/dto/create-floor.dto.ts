/* eslint-disable prettier/prettier */

import { IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiPropertyOptional } from "@nestjs/swagger";

export class CreateFloorDto {
  @IsOptional()
  @IsString()
  uid?: string;

  @IsString()
  buildingUuid: string;

  @IsString()
  floorCode: string;

  @IsString()
  floorName: string;

  @IsNumber()
  floorNumber: number;

  @IsOptional()
  @IsNumber()
  unitsCount?: number;

  @IsOptional()
  @IsString()
  addedBy?: string;
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