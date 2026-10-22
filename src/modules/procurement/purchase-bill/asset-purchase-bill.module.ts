import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProcurementAssetPurchaseBill } from 'src/database/models/procurement/purchase-bill/pr_asset_purchase_bill.model';
import { ProcurementAssetPurchaseBillGrn } from 'src/database/models/procurement/purchase-bill/pr_asset_purchase_bill_grn.model';
import { ProcurementAssetGrn } from 'src/database/models/procurement/grn/pr_asset_grn.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { SupplierAccounts } from 'src/database/models/projects/contract/pr_supplier_accounts.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { ProjectType } from 'src/database/models/projects/project-type/pr_project_type.model';
import { AssetPurchaseBillController } from './asset-purchase-bill.controller';
import { AssetPurchaseBillService } from './asset-purchase-bill.service';
@Module({ imports: [SequelizeModule.forFeature([ProcurementAssetPurchaseBill, ProcurementAssetPurchaseBillGrn, ProcurementAssetGrn, SysUser, SupplierAccounts, Project, ProjectType])], controllers: [AssetPurchaseBillController], providers: [AssetPurchaseBillService] })
export class AssetPurchaseBillModule {}
