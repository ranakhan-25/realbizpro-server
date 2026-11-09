/* eslint-disable prettier/prettier */

import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateBonusGenerateDto } from './create-bonus-generate.dto';
import { IsOptional, IsString } from "class-validator";

export class UpdateBonusGenerateDto extends PartialType(
  CreateBonusGenerateDto,
) {
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    updatedBy?: string;
}
