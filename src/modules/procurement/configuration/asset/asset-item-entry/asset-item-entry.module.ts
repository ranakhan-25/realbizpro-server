import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProcurementAssetCategory } from 'src/database/models/procurement/configuration/asset/pr_asset_category.model';
import { ProcurementAssetItemEntry } from 'src/database/models/procurement/configuration/asset/pr_asset_item_entry.model';
import { ProcurementBrand } from 'src/database/models/procurement/configuration/products/pr_brand.model';
import { ProcurementUnit } from 'src/database/models/procurement/configuration/products/pr_unit.model';
import { ProcurementAssetItemEntryController } from './asset-item-entry.controller';
import { ProcurementAssetItemEntryService } from './asset-item-entry.service';

@Module({
  imports: [SequelizeModule.forFeature([ProcurementAssetItemEntry, ProcurementAssetCategory, ProcurementBrand, ProcurementUnit])],
  controllers: [ProcurementAssetItemEntryController],
  providers: [ProcurementAssetItemEntryService],
})
export class ProcurementAssetItemEntryModule {}
