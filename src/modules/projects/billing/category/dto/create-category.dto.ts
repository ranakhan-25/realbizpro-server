/* eslint-disable prettier/prettier */

import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { CategoryType } from 'src/database/models/projects/billing/pr_category.model';
import { ApiPropertyOptional } from "@nestjs/swagger";

export class CreateCategoryDto {
  @IsEnum(CategoryType)
  @IsNotEmpty()
  type: CategoryType;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  code: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  createdBy?: string;

  @IsString()
  @IsOptional()
  updatedBy?: string;
    @ApiPropertyOptional({ description: 'Organization ID', example: 1 })
    @IsOptional()
    orgId?: number;
}
