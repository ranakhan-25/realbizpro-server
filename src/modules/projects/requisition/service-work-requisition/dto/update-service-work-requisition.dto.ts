import { PartialType } from '@nestjs/mapped-types';

import { CreateServiceWorkRequisitionDto } from './create-service-work-requisition.dto';

export class UpdateServiceWorkRequisitionDto extends PartialType(
  CreateServiceWorkRequisitionDto,
) {}
