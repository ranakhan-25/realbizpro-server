/* eslint-disable prettier/prettier */

import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateUnitDto } from './create-unit.dto';
import { IsOptional, IsString } from "class-validator";

export class UpdateUnitDto extends PartialType(
  CreateUnitDto,
) {
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    updatedBy?: string;
}
