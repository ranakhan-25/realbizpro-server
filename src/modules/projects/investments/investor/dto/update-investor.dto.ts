/* eslint-disable prettier/prettier */

import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';

import { CreateInvestorDto } from './create-investor.dto';
import { IsOptional, IsString } from "class-validator";

export class UpdateInvestorDto extends PartialType(
  CreateInvestorDto,
) {
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    updatedBy?: string;
}
