import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceWorkRequisitionItemDto } from './create-service-work-requisition-item.dto';
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateServiceWorkRequisitionItemDto extends PartialType(
  CreateServiceWorkRequisitionItemDto,
) {
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    override updatedBy?: string;
}
