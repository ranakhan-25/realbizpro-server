/* eslint-disable prettier/prettier */

import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';

import { CreateSubCategoryDto } from './create-sub-category.dto';
import { IsOptional, IsString } from "class-validator";

export class UpdateSubCategoryDto extends PartialType(
  CreateSubCategoryDto,
) {
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    override updatedBy?: string;
}