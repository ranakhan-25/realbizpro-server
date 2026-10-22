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
import { Category } from 'src/database/models/procurement/configuration/products/pr_category.model';
import { ProcurementItemEntry } from 'src/database/models/procurement/configuration/products/pr_item_entry.model';
import { ProcurementUnit } from 'src/database/models/procurement/configuration/products/pr_unit.model';
import { ProcurementMaterialRequisition } from 'src/database/models/procurement/requisition/pr_material_requisition.model';
import { ProcurementPurchaseOrder } from 'src/database/models/procurement/purchase-order/pr_purchase_order.model';
import { ProcurementPurchaseOrderItem } from 'src/database/models/procurement/purchase-order/pr_purchase_order_item.model';
import { PurchaseOrderController } from './purchase-order.controller';
import { PurchaseOrderService } from './purchase-order.service';

@Module({
  imports: [SequelizeModule.forFeature([ProcurementPurchaseOrder, ProcurementPurchaseOrderItem, SysCompany, SysUser, SupplierAccounts, Project, ProjectType, BillingCategory, Task, Site, Category, ProcurementItemEntry, ProcurementUnit, ProcurementMaterialRequisition])],
  controllers: [PurchaseOrderController],
  providers: [PurchaseOrderService],
})
export class PurchaseOrderModule {}
