/* eslint-disable prettier/prettier */

import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateBoqDto } from './create-boq.dto';
import { IsOptional, IsString } from "class-validator";

export class UpdateBoqDto extends PartialType(
  CreateBoqDto,
) {
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    updatedBy?: string;
}
