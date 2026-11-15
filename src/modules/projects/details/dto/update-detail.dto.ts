/* eslint-disable prettier/prettier */

import { PartialType } from '@nestjs/mapped-types';
import { CreateDetailsDto } from './create-detail.dto';
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateDetailsDto extends PartialType(CreateDetailsDto) {
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    updatedBy?: string;
}