/* eslint-disable prettier/prettier */

import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateDepartmentDto } from './create-department.dto';
import { IsOptional, IsString } from "class-validator";

export class UpdateDepartmentDto extends PartialType(
  CreateDepartmentDto,
) {
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    updatedBy?: string;
}
