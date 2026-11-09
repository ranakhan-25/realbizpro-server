/* eslint-disable prettier/prettier */
import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateMaterialRequisitionDto } from './create-material-requisition.dto';
import { IsOptional, IsString } from "class-validator";

export class UpdateMaterialRequisitionDto extends PartialType(
  CreateMaterialRequisitionDto,
) {
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    updatedBy?: string;
}
