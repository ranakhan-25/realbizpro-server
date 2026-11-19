// Auto-generated types for ProcurementGrn
// Source: src/database/models/procurement/grn/pr_grn.model.ts

import { ProcurementGrnApprovalLayer } from '../models/procurement/grn/pr_grn.model';
import { ProcurementGrnStatus } from '../models/procurement/grn/pr_grn.model';

import type { SysCompany } from '../models/system/sys_company.model';
import type { SupplierAccounts } from '../models/projects/contract/pr_supplier_accounts.model';
import type { ProjectType } from '../models/projects/project-type/pr_project_type.model';
import type { Project } from '../models/projects/project/pr_project.model';
import type { BillingCategory } from '../models/projects/billing/pr_category.model';
import type { Task } from '../models/projects/task/pr_task.model';
import type { Site } from '../models/projects/project-site/pr_project_site.model';
import type { Category } from '../models/procurement/configuration/products/pr_category.model';
import type { ProcurementPurchaseOrder } from '../models/procurement/purchase-order/pr_purchase_order.model';
import type { ProcurementMaterialRequisition } from '../models/procurement/requisition/pr_material_requisition.model';
import type { SysUser } from '../models/system/sys_user.model';
import type { ProcurementGrnItem } from '../models/procurement/grn/pr_grn_item.model';
import type { ProcurementMaterialIssue } from '../models/procurement/material-issue/pr_material_issue.model';
import type { ProcurementPurchaseBill } from '../models/procurement/purchase-bill/pr_purchase_bill.model';
import type { SysOrganization } from '../models/system/sys_organization.model';

export interface ProcurementGrnAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  date: string;
  code: string;
  reference?: string | null;
  company_id?: string | null;
  supplier_id: string;
  project_type_id?: string | null;
  project_id?: string | null;
  title_of_work_id?: string | null;
  task_id?: string | null;
  site_id?: string | null;
  category_id?: string | null;
  purchase_order_id?: string | null;
  requisition_id?: string | null;
  subtotal: number;
  discount: number;
  grand_total: number;
  paid: number;
  due: number;
  note?: string | null;
  attachment?: string | null;
  already_billed: boolean;
  added_by_id?: number | null;
  approval_layer: ProcurementGrnApprovalLayer;
  status: ProcurementGrnStatus;
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
  purchaseOrder?: ProcurementPurchaseOrder;
  requisition?: ProcurementMaterialRequisition;
  addedBy?: SysUser;
  items?: ProcurementGrnItem[];
  materialIssues?: ProcurementMaterialIssue[];
  purchaseBills?: ProcurementPurchaseBill[];
  organization?: SysOrganization;
}

export interface ProcurementGrnCreationAttributes {
  date: string;
  code: string;
  reference?: string | null;
  company_id?: string | null;
  supplier_id: string;
  project_type_id?: string | null;
  project_id?: string | null;
  title_of_work_id?: string | null;
  task_id?: string | null;
  site_id?: string | null;
  category_id?: string | null;
  purchase_order_id?: string | null;
  requisition_id?: string | null;
  subtotal?: number; // Has default value
  discount?: number; // Has default value
  grand_total?: number; // Has default value
  paid?: number; // Has default value
  due?: number; // Has default value
  note?: string | null;
  attachment?: string | null;
  already_billed?: boolean; // Has default value
  added_by_id?: number | null;
  approval_layer?: ProcurementGrnApprovalLayer; // Has default value
  status?: ProcurementGrnStatus; // Has default value
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
}

export type ProcurementGrnUpdateAttributes = Partial<ProcurementGrnCreationAttributes>;

// Helper type for including relations
export interface ProcurementGrnWithRelations extends ProcurementGrnAttributes {
  company?: SysCompany;
  supplier?: SupplierAccounts;
  projectType?: ProjectType;
  project?: Project;
  titleOfWork?: BillingCategory;
  task?: Task;
  site?: Site;
  category?: Category;
  purchaseOrder?: ProcurementPurchaseOrder;
  requisition?: ProcurementMaterialRequisition;
  addedBy?: SysUser;
  items?: ProcurementGrnItem[];
  materialIssues?: ProcurementMaterialIssue[];
  purchaseBills?: ProcurementPurchaseBill[];
  organization?: SysOrganization;
}
