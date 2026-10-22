import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Category } from 'src/database/models/procurement/configuration/products/pr_category.model';
import { ProcurementBrand } from 'src/database/models/procurement/configuration/products/pr_brand.model';
import { ProcurementItemEntry } from 'src/database/models/procurement/configuration/products/pr_item_entry.model';
import { ProcurementSubCategory } from 'src/database/models/procurement/configuration/products/pr_sub_category.model';
import { ProcurementUnit } from 'src/database/models/procurement/configuration/products/pr_unit.model';
import { ProcurementItemEntryController } from './item-entry.controller';
import { ProcurementItemEntryService } from './item-entry.service';

@Module({
  imports: [SequelizeModule.forFeature([ProcurementItemEntry, Category, ProcurementSubCategory, ProcurementBrand, ProcurementUnit])],
  controllers: [ProcurementItemEntryController],
  providers: [ProcurementItemEntryService],
})
export class ProcurementItemEntryModule {}
