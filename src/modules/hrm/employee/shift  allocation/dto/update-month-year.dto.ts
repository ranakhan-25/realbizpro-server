/* eslint-disable prettier/prettier */

import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateMonthYearDto } from './create-month-year.dto';
import { IsOptional, IsString } from "class-validator";

export class UpdateMonthYearDto extends PartialType(
  CreateMonthYearDto,
) {
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    updatedBy?: string;
}
