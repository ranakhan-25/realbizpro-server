/* eslint-disable prettier/prettier */

import { PartialType } from '@nestjs/mapped-types';
import { CreateFlatLandDto } from './create-flatland.dto';
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateFlatLandDto extends PartialType(CreateFlatLandDto) {
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    updatedBy?: string;
}