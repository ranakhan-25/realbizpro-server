/* eslint-disable prettier/prettier */

import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateEmployeeSalaryDto } from './create-employee-salary.dto';
import { IsOptional, IsString } from "class-validator";

export class UpdateEmployeeSalaryDto extends PartialType(
  CreateEmployeeSalaryDto,
) {
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    updatedBy?: string;
}
