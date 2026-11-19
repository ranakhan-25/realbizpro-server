// Auto-generated types for ProcurementAssetGrn
// Source: src/database/models/procurement/grn/pr_asset_grn.model.ts

import { ProcurementAssetGrnApprovalLayer } from '../models/procurement/grn/pr_asset_grn.model';
import { ProcurementAssetGrnStatus } from '../models/procurement/grn/pr_asset_grn.model';

import type { SupplierAccounts } from '../models/projects/contract/pr_supplier_accounts.model';
import type { ProjectType } from '../models/projects/project-type/pr_project_type.model';
import type { Project } from '../models/projects/project/pr_project.model';
import type { BillingCategory } from '../models/projects/billing/pr_category.model';
import type { Task } from '../models/projects/task/pr_task.model';
import type { Site } from '../models/projects/project-site/pr_project_site.model';
import type { ProcurementAssetCategory } from '../models/procurement/configuration/asset/pr_asset_category.model';
import type { SysUser } from '../models/system/sys_user.model';
import type { ProcurementAssetGrnItem } from '../models/procurement/grn/pr_asset_grn_item.model';
import type { ProcurementAssetPurchaseBill } from '../models/procurement/purchase-bill/pr_asset_purchase_bill.model';
import type { SysOrganization } from '../models/system/sys_organization.model';

export interface ProcurementAssetGrnAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  date: string;
  code: string;
  reference?: string | null;
  supplier_id: string;
  ledger_id?: string | null;
  ledger_name?: string | null;
  project_type_id?: string | null;
  project_id?: string | null;
  title_of_work_id?: string | null;
  task_id?: string | null;
  site_id?: string | null;
  category_id?: string | null;
  subtotal: number;
  discount: number;
  grand_total: number;
  paid: number;
  due: number;
  already_billed: boolean;
  note?: string | null;
  attachment?: string | null;
  added_by_id?: number | null;
  approval_layer: ProcurementAssetGrnApprovalLayer;
  status: ProcurementAssetGrnStatus;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;

  // Relations
  supplier?: SupplierAccounts;
  projectType?: ProjectType;
  project?: Project;
  titleOfWork?: BillingCategory;
  task?: Task;
  site?: Site;
  category?: ProcurementAssetCategory;
  addedBy?: SysUser;
  items?: ProcurementAssetGrnItem[];
  purchaseBills?: ProcurementAssetPurchaseBill[];
  organization?: SysOrganization;
}

export interface ProcurementAssetGrnCreationAttributes {
  date: string;
  code: string;
  reference?: string | null;
  supplier_id: string;
  ledger_id?: string | null;
  ledger_name?: string | null;
  project_type_id?: string | null;
  project_id?: string | null;
  title_of_work_id?: string | null;
  task_id?: string | null;
  site_id?: string | null;
  category_id?: string | null;
  subtotal?: number; // Has default value
  discount?: number; // Has default value
  grand_total?: number; // Has default value
  paid?: number; // Has default value
  due?: number; // Has default value
  already_billed?: boolean; // Has default value
  note?: string | null;
  attachment?: string | null;
  added_by_id?: number | null;
  approval_layer?: ProcurementAssetGrnApprovalLayer; // Has default value
  status?: ProcurementAssetGrnStatus; // Has default value
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
}

export type ProcurementAssetGrnUpdateAttributes = Partial<ProcurementAssetGrnCreationAttributes>;

// Helper type for including relations
export interface ProcurementAssetGrnWithRelations extends ProcurementAssetGrnAttributes {
  supplier?: SupplierAccounts;
  projectType?: ProjectType;
  project?: Project;
  titleOfWork?: BillingCategory;
  task?: Task;
  site?: Site;
  category?: ProcurementAssetCategory;
  addedBy?: SysUser;
  items?: ProcurementAssetGrnItem[];
  purchaseBills?: ProcurementAssetPurchaseBill[];
  organization?: SysOrganization;
}
