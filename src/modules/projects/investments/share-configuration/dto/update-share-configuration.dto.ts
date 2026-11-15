/* eslint-disable prettier/prettier */

import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';

import { CreateShareConfigurationDto } from './create-share-configuration.dto';
import { IsOptional, IsString } from "class-validator";

export class UpdateShareConfigurationDto extends PartialType(
  CreateShareConfigurationDto,
) {
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    updatedBy?: string;
}
