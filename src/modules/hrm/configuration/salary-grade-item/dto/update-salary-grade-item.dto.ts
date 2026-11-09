/* eslint-disable prettier/prettier */

import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateSalaryGradeItemDto } from './create-salary-grade-item.dto';
import { IsOptional, IsString } from "class-validator";

export class UpdateSalaryGradeItemDto extends PartialType(
  CreateSalaryGradeItemDto,
) {
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    updatedBy?: string;
}
