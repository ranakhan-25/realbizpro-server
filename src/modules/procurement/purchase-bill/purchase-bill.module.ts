import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProcurementPurchaseBill } from 'src/database/models/procurement/purchase-bill/pr_purchase_bill.model';
import { ProcurementPurchaseBillGrn } from 'src/database/models/procurement/purchase-bill/pr_purchase_bill_grn.model';
import { ProcurementGrn } from 'src/database/models/procurement/grn/pr_grn.model';
import { SysCompany } from 'src/database/models/system/sys_company.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { SupplierAccounts } from 'src/database/models/projects/contract/pr_supplier_accounts.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { ProjectType } from 'src/database/models/projects/project-type/pr_project_type.model';
import { PurchaseBillController } from './purchase-bill.controller';
import { PurchaseBillService } from './purchase-bill.service';
@Module({ imports: [SequelizeModule.forFeature([ProcurementPurchaseBill, ProcurementPurchaseBillGrn, ProcurementGrn, SysCompany, SysUser, SupplierAccounts, Project, ProjectType])], controllers: [PurchaseBillController], providers: [PurchaseBillService] })
export class PurchaseBillModule {}
