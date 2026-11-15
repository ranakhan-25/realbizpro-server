/* eslint-disable prettier/prettier */

import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateSectionDto } from './create-section.dto';
import { IsOptional, IsString } from "class-validator";

export class UpdateSectionDto extends PartialType(
  CreateSectionDto,
) {
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    updatedBy?: string;
}
