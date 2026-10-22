import { PartialType } from '@nestjs/swagger';
import { CreateAssetRequisitionDto } from './create-asset-requisition.dto';
export class UpdateAssetRequisitionDto extends PartialType(CreateAssetRequisitionDto) {}
