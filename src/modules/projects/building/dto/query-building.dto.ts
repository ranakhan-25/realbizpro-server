/* eslint-disable prettier/prettier */

import { Transform } from 'class-transformer';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class QueryBuildingDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  buildingName?: string;

  @IsOptional()
  @IsString()
  buildingCode?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  siteUid?: string;

  @IsOptional()
  @IsString()
  siteUuid?: string;

  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  limit?: string;

  @IsOptional()
  @IsString()
  skip?: string;

  @IsOptional()
  @IsIn(['buildingCode', 'buildingName', 'floorsCount', 'unitsCount', 'status', 'createdAt'])
  sortBy?: string;

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC';

  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true')
  withDeleted?: boolean;
}
