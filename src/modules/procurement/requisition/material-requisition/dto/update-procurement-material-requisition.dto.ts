import { PartialType } from '@nestjs/swagger';
import { CreateProcurementMaterialRequisitionDto } from './create-procurement-material-requisition.dto';
export class UpdateProcurementMaterialRequisitionDto extends PartialType(CreateProcurementMaterialRequisitionDto) {}
