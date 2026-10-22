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
import { MaterialRequisition } from 'src/database/models/projects/material-requisition/pr_material_requisition.model';
import { Category } from 'src/database/models/procurement/configuration/products/pr_category.model';
import { ProcurementItemEntry } from 'src/database/models/procurement/configuration/products/pr_item_entry.model';
import { ProcurementUnit } from 'src/database/models/procurement/configuration/products/pr_unit.model';
import { ProcurementRfq } from 'src/database/models/procurement/rfq/pr_rfq.model';
import { ProcurementRfqItem } from 'src/database/models/procurement/rfq/pr_rfq_item.model';
import { RfqController } from './rfq.controller';
import { RfqService } from './rfq.service';

@Module({ imports: [SequelizeModule.forFeature([ProcurementRfq, ProcurementRfqItem, SysCompany, SysUser, SupplierAccounts, Project, ProjectType, BillingCategory, Task, Site, MaterialRequisition, Category, ProcurementItemEntry, ProcurementUnit])], controllers: [RfqController], providers: [RfqService] })
export class RfqModule {}
