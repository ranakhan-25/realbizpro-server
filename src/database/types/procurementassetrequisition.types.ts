// Auto-generated types for ProcurementAssetRequisition
// Source: src/database/models/procurement/requisition/pr_asset_requisition.model.ts

import { ProcurementAssetRequisitionApprovalLayer } from '../models/procurement/requisition/pr_asset_requisition.model';
import { ProcurementAssetRequisitionStatus } from '../models/procurement/requisition/pr_asset_requisition.model';

import type { SysCompany } from '../models/system/sys_company.model';
import type { SupplierAccounts } from '../models/projects/contract/pr_supplier_accounts.model';
import type { ProjectType } from '../models/projects/project-type/pr_project_type.model';
import type { Project } from '../models/projects/project/pr_project.model';
import type { BillingCategory } from '../models/projects/billing/pr_category.model';
import type { Task } from '../models/projects/task/pr_task.model';
import type { Site } from '../models/projects/project-site/pr_project_site.model';
import type { ProcurementAssetCategory } from '../models/procurement/configuration/asset/pr_asset_category.model';
import type { SysUser } from '../models/system/sys_user.model';
import type { ProcurementAssetRequisitionItem } from '../models/procurement/requisition/pr_asset_requisition_item.model';
import type { ProcurementAssetPurchaseOrder } from '../models/procurement/purchase-order/pr_asset_purchase_order.model';
import type { ProcurementHireOrder } from '../models/procurement/equipment-hire/pr_hire_order.model';
import type { SysOrganization } from '../models/system/sys_organization.model';

export interface ProcurementAssetRequisitionAttributes {
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
  approval_layer: ProcurementAssetRequisitionApprovalLayer;
  status: ProcurementAssetRequisitionStatus;
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
  addedBy?: SysUser;
  items?: ProcurementAssetRequisitionItem[];
  purchaseOrders?: ProcurementAssetPurchaseOrder[];
  hireOrders?: ProcurementHireOrder[];
  organization?: SysOrganization;
}

export interface ProcurementAssetRequisitionCreationAttributes {
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
  approval_layer?: ProcurementAssetRequisitionApprovalLayer; // Has default value
  status?: ProcurementAssetRequisitionStatus; // Has default value
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
}

export type ProcurementAssetRequisitionUpdateAttributes = Partial<ProcurementAssetRequisitionCreationAttributes>;

// Helper type for including relations
export interface ProcurementAssetRequisitionWithRelations extends ProcurementAssetRequisitionAttributes {
  company?: SysCompany;
  supplier?: SupplierAccounts;
  projectType?: ProjectType;
  project?: Project;
  titleOfWork?: BillingCategory;
  task?: Task;
  site?: Site;
  category?: ProcurementAssetCategory;
  addedBy?: SysUser;
  items?: ProcurementAssetRequisitionItem[];
  purchaseOrders?: ProcurementAssetPurchaseOrder[];
  hireOrders?: ProcurementHireOrder[];
  organization?: SysOrganization;
}
