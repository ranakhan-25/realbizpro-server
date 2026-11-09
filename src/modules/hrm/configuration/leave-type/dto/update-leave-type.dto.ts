/* eslint-disable prettier/prettier */

import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateLeaveTypeDto } from './create-leave-type.dto';
import { IsOptional, IsString } from "class-validator";

export class UpdateLeaveTypeDto extends PartialType(
  CreateLeaveTypeDto,
) {
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    updatedBy?: string;
}
