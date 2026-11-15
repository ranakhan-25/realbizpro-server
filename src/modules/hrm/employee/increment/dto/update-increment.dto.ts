/* eslint-disable prettier/prettier */

import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateIncrementDto } from './create-increment.dto';
import { IsOptional, IsString } from "class-validator";

export class UpdateIncrementDto extends PartialType(
  CreateIncrementDto,
) {
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    updatedBy?: string;
}
