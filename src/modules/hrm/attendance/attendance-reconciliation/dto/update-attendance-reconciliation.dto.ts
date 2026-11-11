/* eslint-disable prettier/prettier */

import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateAttendanceReconciliationDto } from './create-attendance-reconciliation.dto';
import { IsOptional, IsString } from "class-validator";

export class UpdateAttendanceReconciliationDto extends PartialType(
  CreateAttendanceReconciliationDto,
) {
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    updatedBy?: string;
}
