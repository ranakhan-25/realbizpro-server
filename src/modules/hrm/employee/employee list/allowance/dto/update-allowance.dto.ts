/* eslint-disable prettier/prettier */

import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateAllowanceDto } from './create-allowance.dto';
import { IsOptional, IsString } from "class-validator";

export class UpdateAllowanceDto extends PartialType(
  CreateAllowanceDto,
) {
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    updatedBy?: string;
}
