import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { SupplierAccounts } from 'src/database/models/projects/contract/pr_supplier_accounts.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { ProjectType } from 'src/database/models/projects/project-type/pr_project_type.model';
import { BillingCategory } from 'src/database/models/projects/billing/pr_category.model';
import { Task } from 'src/database/models/projects/task/pr_task.model';
import { Site } from 'src/database/models/projects/project-site/pr_project_site.model';
import { ProcurementAssetCategory } from 'src/database/models/procurement/configuration/asset/pr_asset_category.model';
import { ProcurementAssetItemEntry } from 'src/database/models/procurement/configuration/asset/pr_asset_item_entry.model';
import { ProcurementUnit } from 'src/database/models/procurement/configuration/products/pr_unit.model';
import { CategoryAccountMapping } from 'src/database/models/procurement/configuration/products/pr_category_account_mapping.model';
import { ProcurementAssetGrn } from 'src/database/models/procurement/grn/pr_asset_grn.model';
import { ProcurementAssetGrnItem } from 'src/database/models/procurement/grn/pr_asset_grn_item.model';
import { AssetGrnController } from './asset-grn.controller';
import { AssetGrnService } from './asset-grn.service';
import { AssetPurchaseBillModule } from '../../purchase-bill/asset-purchase-bill.module';

@Module({
  imports: [SequelizeModule.forFeature([ProcurementAssetGrn, ProcurementAssetGrnItem, SysUser, SupplierAccounts, Project, ProjectType, BillingCategory, Task, Site, ProcurementAssetCategory, ProcurementAssetItemEntry, ProcurementUnit, CategoryAccountMapping]), AssetPurchaseBillModule],
  controllers: [AssetGrnController],
  providers: [AssetGrnService],
})
export class AssetGrnModule {}
