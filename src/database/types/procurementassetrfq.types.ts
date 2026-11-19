// Auto-generated types for ProcurementAssetRfq
// Source: src/database/models/procurement/rfq/pr_asset_rfq.model.ts

import type { SysCompany } from '../models/system/sys_company.model';
import type { SupplierAccounts } from '../models/projects/contract/pr_supplier_accounts.model';
import type { ProjectType } from '../models/projects/project-type/pr_project_type.model';
import type { Project } from '../models/projects/project/pr_project.model';
import type { BillingCategory } from '../models/projects/billing/pr_category.model';
import type { Task } from '../models/projects/task/pr_task.model';
import type { Site } from '../models/projects/project-site/pr_project_site.model';
import type { ProcurementAssetCategory } from '../models/procurement/configuration/asset/pr_asset_category.model';
import type { MaterialRequisition } from '../models/projects/material-requisition/pr_material_requisition.model';
import type { SysUser } from '../models/system/sys_user.model';
import type { ProcurementAssetRfqItem } from '../models/procurement/rfq/pr_asset_rfq_item.model';
import type { SysOrganization } from '../models/system/sys_organization.model';

export interface ProcurementAssetRfqAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  code: string;
  date: string;
  company_id?: string | null;
  supplier_id: string;
  project_type_id?: string | null;
  project_id?: string | null;
  title_of_work_id?: string | null;
  task_id?: string | null;
  site_id?: string | null;
  category_id?: string | null;
  requisition_id?: string | null;
  reference?: string | null;
  subtotal: number;
  grand_total: number;
  attachment?: string | null;
  added_by_id?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;

  // Relations
  company?: SysCompany;
  supplier?: SupplierAccounts;
  projectType?: ProjectType;
  project?: Project;
  titleOfWork?: BillingCategory;
  task?: Task;
  site?: Site;
  category?: ProcurementAssetCategory;
  requisition?: MaterialRequisition;
  addedBy?: SysUser;
  items?: ProcurementAssetRfqItem[];
  organization?: SysOrganization;
}

export interface ProcurementAssetRfqCreationAttributes {
  code: string;
  date: string;
  company_id?: string | null;
  supplier_id: string;
  project_type_id?: string | null;
  project_id?: string | null;
  title_of_work_id?: string | null;
  task_id?: string | null;
  site_id?: string | null;
  category_id?: string | null;
  requisition_id?: string | null;
  reference?: string | null;
  subtotal?: number; // Has default value
  grand_total?: number; // Has default value
  attachment?: string | null;
  added_by_id?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
}

export type ProcurementAssetRfqUpdateAttributes = Partial<ProcurementAssetRfqCreationAttributes>;

// Helper type for including relations
export interface ProcurementAssetRfqWithRelations extends ProcurementAssetRfqAttributes {
  company?: SysCompany;
  supplier?: SupplierAccounts;
  projectType?: ProjectType;
  project?: Project;
  titleOfWork?: BillingCategory;
  task?: Task;
  site?: Site;
  category?: ProcurementAssetCategory;
  requisition?: MaterialRequisition;
  addedBy?: SysUser;
  items?: ProcurementAssetRfqItem[];
  organization?: SysOrganization;
}
