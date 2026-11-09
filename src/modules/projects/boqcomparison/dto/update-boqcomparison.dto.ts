/* eslint-disable prettier/prettier */

import { PartialType } from '@nestjs/mapped-types';
import { CreateBoqComparisonDto } from './create-boqcomparison.dto';
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateBoqComparisonDto extends PartialType(CreateBoqComparisonDto) {
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    updatedBy?: string;
}