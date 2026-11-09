/* eslint-disable prettier/prettier */

import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateEmployeeTypeDto } from './create-employee-type.dto';
import { IsOptional, IsString } from "class-validator";

export class UpdateEmployeeTypeDto extends PartialType(
  CreateEmployeeTypeDto,
) {
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    updatedBy?: string;
}
