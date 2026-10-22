import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProcurementGrn } from 'src/database/models/procurement/grn/pr_grn.model';
import { ProcurementGrnItem } from 'src/database/models/procurement/grn/pr_grn_item.model';
import { ProcurementPurchaseOrder } from 'src/database/models/procurement/purchase-order/pr_purchase_order.model';
import { ProcurementPurchaseBill } from 'src/database/models/procurement/purchase-bill/pr_purchase_bill.model';
import { ProcurementPurchaseBillGrn } from 'src/database/models/procurement/purchase-bill/pr_purchase_bill_grn.model';
import { Category } from 'src/database/models/procurement/configuration/products/pr_category.model';
import { ProcurementItemEntry } from 'src/database/models/procurement/configuration/products/pr_item_entry.model';
import { SupplierAccounts } from 'src/database/models/projects/contract/pr_supplier_accounts.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { ProjectType } from 'src/database/models/projects/project-type/pr_project_type.model';
import { GrnVsInvoiceController } from './grn-vs-invoice.controller';
import { GrnVsInvoiceService } from './grn-vs-invoice.service';
@Module({ imports: [SequelizeModule.forFeature([ProcurementGrn, ProcurementGrnItem, ProcurementPurchaseOrder, ProcurementPurchaseBill, ProcurementPurchaseBillGrn, Category, ProcurementItemEntry, SupplierAccounts, Project, ProjectType])], controllers: [GrnVsInvoiceController], providers: [GrnVsInvoiceService] })
export class GrnVsInvoiceModule {}
