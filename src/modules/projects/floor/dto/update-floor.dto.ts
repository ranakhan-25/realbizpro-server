/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */

import { PartialType } from '@nestjs/mapped-types';
import { CreateFloorDto } from './create-floor.dto';
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateFloorDto extends PartialType(CreateFloorDto) {
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    updatedBy?: string;
}