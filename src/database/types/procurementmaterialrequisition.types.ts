// Auto-generated types for ProcurementMaterialRequisition
// Source: src/database/models/procurement/requisition/pr_material_requisition.model.ts

import { ProcurementMaterialRequisitionApprovalLayer } from '../models/procurement/requisition/pr_material_requisition.model';
import { ProcurementMaterialRequisitionStatus } from '../models/procurement/requisition/pr_material_requisition.model';

import type { SysCompany } from '../models/system/sys_company.model';
import type { SupplierAccounts } from '../models/projects/contract/pr_supplier_accounts.model';
import type { ProjectType } from '../models/projects/project-type/pr_project_type.model';
import type { Project } from '../models/projects/project/pr_project.model';
import type { BillingCategory } from '../models/projects/billing/pr_category.model';
import type { Task } from '../models/projects/task/pr_task.model';
import type { Site } from '../models/projects/project-site/pr_project_site.model';
import type { Category } from '../models/procurement/configuration/products/pr_category.model';
import type { SysUser } from '../models/system/sys_user.model';
import type { ProcurementMaterialRequisitionItem } from '../models/procurement/requisition/pr_material_requisition_item.model';
import type { ProcurementGrn } from '../models/procurement/grn/pr_grn.model';
import type { ProcurementPurchaseOrder } from '../models/procurement/purchase-order/pr_purchase_order.model';
import type { SysOrganization } from '../models/system/sys_organization.model';

export interface ProcurementMaterialRequisitionAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  date: string;
  demand_date?: string | null;
  code: string;
  ref?: string | null;
  company_id?: string | null;
  supplier_id?: string | null;
  project_type_id?: string | null;
  project_id?: string | null;
  title_of_work_id?: string | null;
  task_id?: string | null;
  site_id?: string | null;
  category_id?: string | null;
  note?: string | null;
  total: number;
  attachment?: string | null;
  added_by_id?: number | null;
  approval_layer: ProcurementMaterialRequisitionApprovalLayer;
  status: ProcurementMaterialRequisitionStatus;
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
  category?: Category;
  addedBy?: SysUser;
  items?: ProcurementMaterialRequisitionItem[];
  grns?: ProcurementGrn[];
  purchaseOrders?: ProcurementPurchaseOrder[];
  organization?: SysOrganization;
}

export interface ProcurementMaterialRequisitionCreationAttributes {
  date: string;
  demand_date?: string | null;
  code: string;
  ref?: string | null;
  company_id?: string | null;
  supplier_id?: string | null;
  project_type_id?: string | null;
  project_id?: string | null;
  title_of_work_id?: string | null;
  task_id?: string | null;
  site_id?: string | null;
  category_id?: string | null;
  note?: string | null;
  total?: number; // Has default value
  attachment?: string | null;
  added_by_id?: number | null;
  approval_layer?: ProcurementMaterialRequisitionApprovalLayer; // Has default value
  status?: ProcurementMaterialRequisitionStatus; // Has default value
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
}

export type ProcurementMaterialRequisitionUpdateAttributes = Partial<ProcurementMaterialRequisitionCreationAttributes>;

// Helper type for including relations
export interface ProcurementMaterialRequisitionWithRelations extends ProcurementMaterialRequisitionAttributes {
  company?: SysCompany;
  supplier?: SupplierAccounts;
  projectType?: ProjectType;
  project?: Project;
  titleOfWork?: BillingCategory;
  task?: Task;
  site?: Site;
  category?: Category;
  addedBy?: SysUser;
  items?: ProcurementMaterialRequisitionItem[];
  grns?: ProcurementGrn[];
  purchaseOrders?: ProcurementPurchaseOrder[];
  organization?: SysOrganization;
}
