/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/swagger';
import { CreateMaterialRequisitionDto } from './create-material-requisition.dto';

export class UpdateMaterialRequisitionDto extends PartialType(
  CreateMaterialRequisitionDto,
) {}
