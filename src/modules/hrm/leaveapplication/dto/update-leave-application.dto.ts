/* eslint-disable prettier/prettier */
import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateLeaveApplicationDto } from './create-leave-application.dto';
import { IsOptional, IsString } from "class-validator";

export class UpdateLeaveApplicationDto extends PartialType(
  CreateLeaveApplicationDto,
) {
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    updatedBy?: string;
}
