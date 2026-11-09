/* eslint-disable prettier/prettier */

import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateHolidayDto } from './create-holiday.dto';
import { IsOptional, IsString } from "class-validator";

export class UpdateHolidayDto extends PartialType(
  CreateHolidayDto,
) {
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    updatedBy?: string;
}
