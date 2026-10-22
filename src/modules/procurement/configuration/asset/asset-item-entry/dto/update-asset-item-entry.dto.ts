import { PartialType } from '@nestjs/swagger';
import { CreateProcurementAssetItemEntryDto } from './create-asset-item-entry.dto';

export class UpdateProcurementAssetItemEntryDto extends PartialType(CreateProcurementAssetItemEntryDto) {}
