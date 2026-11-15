/* eslint-disable prettier/prettier */
import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateMaterialRequisitionItemDto } from './create-material-requisition-item.dto';
import { IsOptional, IsString } from "class-validator";

export class UpdateMaterialRequisitionItemDto extends PartialType(
  CreateMaterialRequisitionItemDto,
) {
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    updatedBy?: string;
}
