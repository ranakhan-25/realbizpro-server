/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/swagger';
import { CreateMaterialRequisitionItemDto } from './create-material-requisition-item.dto';

export class UpdateMaterialRequisitionItemDto extends PartialType(
  CreateMaterialRequisitionItemDto,
) {}
