/* eslint-disable prettier/prettier */

import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';

import { CreateCategoryDto } from './create-category.dto';
import { IsOptional, IsString } from "class-validator";

export class UpdateCategoryDto extends PartialType(
  CreateCategoryDto,
) {
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    override updatedBy?: string;
}
