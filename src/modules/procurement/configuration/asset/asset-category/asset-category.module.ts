import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProcurementAssetCategory } from 'src/database/models/procurement/configuration/asset/pr_asset_category.model';
import { ProcurementAssetCategoryController } from './asset-category.controller';
import { ProcurementAssetCategoryService } from './asset-category.service';

@Module({
  imports: [SequelizeModule.forFeature([ProcurementAssetCategory])],
  controllers: [ProcurementAssetCategoryController],
  providers: [ProcurementAssetCategoryService],
})
export class ProcurementAssetCategoryModule {}
