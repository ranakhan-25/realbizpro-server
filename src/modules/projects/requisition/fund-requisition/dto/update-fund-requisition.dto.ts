/* eslint-disable prettier/prettier */

import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';

import { CreateFundRequisitionDto } from './create-fund-requisition.dto';
import { IsOptional, IsString } from "class-validator";

export class UpdateFundRequisitionDto extends PartialType(
  CreateFundRequisitionDto,
) {
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    override updatedBy?: string;
}
