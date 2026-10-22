import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SysCompany } from 'src/database/models/system/sys_company.model';
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
import { ProcurementAssetRequisition } from 'src/database/models/procurement/requisition/pr_asset_requisition.model';
import { ProcurementAssetRequisitionItem } from 'src/database/models/procurement/requisition/pr_asset_requisition_item.model';
import { AssetRequisitionController } from './asset-requisition.controller';
import { AssetRequisitionService } from './asset-requisition.service';

@Module({
  imports: [SequelizeModule.forFeature([ProcurementAssetRequisition, ProcurementAssetRequisitionItem, SysCompany, SysUser, SupplierAccounts, Project, ProjectType, BillingCategory, Task, Site, ProcurementAssetCategory, ProcurementAssetItemEntry, ProcurementUnit])],
  controllers: [AssetRequisitionController],
  providers: [AssetRequisitionService],
})
export class AssetRequisitionModule {}
