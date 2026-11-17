/* eslint-disable prettier/prettier */

import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateCommissionDto } from './create-commission.dto';
import { IsOptional, IsString } from "class-validator";

export class UpdateCommissionDto extends PartialType(
  CreateCommissionDto,
) {
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    updatedBy?: string;
}
