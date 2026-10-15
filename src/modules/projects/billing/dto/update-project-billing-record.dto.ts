import { PartialType } from '@nestjs/swagger';
import { CreateProjectBillingRecordDto } from './create-project-billing-record.dto';

export class UpdateProjectBillingRecordDto extends PartialType(
  CreateProjectBillingRecordDto,
) {}
