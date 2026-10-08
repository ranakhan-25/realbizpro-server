import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceWorkRequisitionItemDto } from './create-service-work-requisition-item.dto';

export class UpdateServiceWorkRequisitionItemDto extends PartialType(
  CreateServiceWorkRequisitionItemDto,
) {}
