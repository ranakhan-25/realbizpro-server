import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MaterialUsageService } from './material-usage.service';
import { MaterialUsageController } from './material-usage.controller';
import { InvMaterialUsage } from 'src/database/models/inventory/inv_material_usage.model';
import { InvMaterialUsageItem } from 'src/database/models/inventory/inv_material_usage_item.model';

@Module({
  imports: [SequelizeModule.forFeature([InvMaterialUsage, InvMaterialUsageItem])],
  controllers: [MaterialUsageController],
  providers: [MaterialUsageService],
})
export class MaterialUsageModule {}
