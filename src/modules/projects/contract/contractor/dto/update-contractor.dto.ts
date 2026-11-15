/* eslint-disable prettier/prettier */

import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateContractorDto } from './create-contractor.dto';
import { IsOptional, IsString } from "class-validator";

export class UpdateContractorDto extends PartialType(
  CreateContractorDto,
) {
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    updatedBy?: string;
}
