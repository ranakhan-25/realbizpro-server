// Auto-generated types for ProcurementPurchaseOrder
// Source: src/database/models/procurement/purchase-order/pr_purchase_order.model.ts

import { ProcurementPurchaseOrderApprovalLayer } from '../models/procurement/purchase-order/pr_purchase_order.model';
import { ProcurementPurchaseOrderStatus } from '../models/procurement/purchase-order/pr_purchase_order.model';

import type { SysCompany } from '../models/system/sys_company.model';
import type { SupplierAccounts } from '../models/projects/contract/pr_supplier_accounts.model';
import type { ProjectType } from '../models/projects/project-type/pr_project_type.model';
import type { Project } from '../models/projects/project/pr_project.model';
import type { BillingCategory } from '../models/projects/billing/pr_category.model';
import type { Task } from '../models/projects/task/pr_task.model';
import type { Site } from '../models/projects/project-site/pr_project_site.model';
import type { Category } from '../models/procurement/configuration/products/pr_category.model';
import type { ProcurementMaterialRequisition } from '../models/procurement/requisition/pr_material_requisition.model';
import type { SysUser } from '../models/system/sys_user.model';
import type { ProcurementPurchaseOrderItem } from '../models/procurement/purchase-order/pr_purchase_order_item.model';
import type { ProcurementGrn } from '../models/procurement/grn/pr_grn.model';
import type { SysOrganization } from '../models/system/sys_organization.model';

export interface ProcurementPurchaseOrderAttributes {
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
  requisition_id?: string | null;
  subtotal: number;
  grand_total: number;
  note?: string | null;
  attachment?: string | null;
  content_footer?: string | null;
  added_by_id?: number | null;
  approval_layer: ProcurementPurchaseOrderApprovalLayer;
  status: ProcurementPurchaseOrderStatus;
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
  requisition?: ProcurementMaterialRequisition;
  addedBy?: SysUser;
  items?: ProcurementPurchaseOrderItem[];
  grns?: ProcurementGrn[];
  organization?: SysOrganization;
}

export interface ProcurementPurchaseOrderCreationAttributes {
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
  requisition_id?: string | null;
  subtotal?: number; // Has default value
  grand_total?: number; // Has default value
  note?: string | null;
  attachment?: string | null;
  content_footer?: string | null;
  added_by_id?: number | null;
  approval_layer?: ProcurementPurchaseOrderApprovalLayer; // Has default value
  status?: ProcurementPurchaseOrderStatus; // Has default value
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
}

export type ProcurementPurchaseOrderUpdateAttributes = Partial<ProcurementPurchaseOrderCreationAttributes>;

// Helper type for including relations
export interface ProcurementPurchaseOrderWithRelations extends ProcurementPurchaseOrderAttributes {
  company?: SysCompany;
  supplier?: SupplierAccounts;
  projectType?: ProjectType;
  project?: Project;
  titleOfWork?: BillingCategory;
  task?: Task;
  site?: Site;
  category?: Category;
  requisition?: ProcurementMaterialRequisition;
  addedBy?: SysUser;
  items?: ProcurementPurchaseOrderItem[];
  grns?: ProcurementGrn[];
  organization?: SysOrganization;
}
