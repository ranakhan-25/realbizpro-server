import { PartialType } from '@nestjs/swagger';
import { CreateProcurementAssetCategoryDto } from './create-asset-category.dto';

export class UpdateProcurementAssetCategoryDto extends PartialType(CreateProcurementAssetCategoryDto) {}
