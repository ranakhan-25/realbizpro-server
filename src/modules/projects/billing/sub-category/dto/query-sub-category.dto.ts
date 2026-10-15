/* eslint-disable prettier/prettier */

import { Transform, Type } from 'class-transformer';

import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { SubCategoryType } from 'src/database/models/projects/billing/pr_sub_category.model';

export class QuerySubCategoryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  skip?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(SubCategoryType)
  type?: SubCategoryType;

  @IsOptional()
  @Transform(({ value }) =>
    value === '' ? undefined : value,
  )
  @IsUUID()
  categoryId?: string;
}
