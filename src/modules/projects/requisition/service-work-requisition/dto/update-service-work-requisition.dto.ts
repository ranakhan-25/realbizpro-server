import { PartialType } from '@nestjs/mapped-types';

import { CreateServiceWorkRequisitionDto } from './create-service-work-requisition.dto';
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateServiceWorkRequisitionDto extends PartialType(
  CreateServiceWorkRequisitionDto,
) {
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    override updatedBy?: string;
}
