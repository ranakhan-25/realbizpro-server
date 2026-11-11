/* eslint-disable prettier/prettier */

import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateDesignationDto } from './create-designation.dto';
import { IsOptional, IsString } from "class-validator";

export class UpdateDesignationDto extends PartialType(
  CreateDesignationDto,
) {
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    updatedBy?: string;
}
