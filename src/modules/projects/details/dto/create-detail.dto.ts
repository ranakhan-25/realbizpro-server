/* eslint-disable prettier/prettier */

import { IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiPropertyOptional } from "@nestjs/swagger";

export class CreateDetailsDto {
  @IsOptional()
  @IsString()
  uid?: string;

  @IsOptional()
  @IsString()
  areaOfLand?: string;

  @IsOptional()
  @IsString()
  nameOfLandOwner?: string;

  @IsOptional()
  @IsString()
  landOwnerDeveloperRatio?: string;

  @IsOptional()
  @IsString()
  valueOfLand?: string;

  @IsOptional()
  @IsString()
  buildArea?: string;

  @IsOptional()
  @IsNumber()
  totalNoOfBuilding?: number;

  @IsOptional()
  @IsNumber()
  totalFloorOfBuilding?: number;

  @IsOptional()
  @IsNumber()
  noOfFlatInEachFloor?: number;

  @IsOptional()
  @IsNumber()
  totalFlatInTheBuilding?: number;

  @IsOptional()
  @IsString()
  flatSize?: string;

  @IsOptional()
  @IsString()
  totalNoOfCarParking?: string;
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