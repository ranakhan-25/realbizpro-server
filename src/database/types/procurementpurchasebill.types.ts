// Auto-generated types for ProcurementPurchaseBill
// Source: src/database/models/procurement/purchase-bill/pr_purchase_bill.model.ts

import type { SysCompany } from '../models/system/sys_company.model';
import type { ProjectType } from '../models/projects/project-type/pr_project_type.model';
import type { Project } from '../models/projects/project/pr_project.model';
import type { SupplierAccounts } from '../models/projects/contract/pr_supplier_accounts.model';
import type { SysUser } from '../models/system/sys_user.model';
import type { ProcurementGrn } from '../models/procurement/grn/pr_grn.model';
import type { SysOrganization } from '../models/system/sys_organization.model';

export interface ProcurementPurchaseBillAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  date: string;
  code: string;
  company_id?: string | null;
  project_type_id?: string | null;
  project_id?: string | null;
  supplier_id: string;
  subtotal: number;
  discount: number;
  grand_total: number;
  paid: number;
  due: number;
  note?: string | null;
  attachment?: string | null;
  added_by_id?: number | null;
  approval_layer: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;

  // Relations
  company?: SysCompany;
  projectType?: ProjectType;
  project?: Project;
  supplier?: SupplierAccounts;
  addedBy?: SysUser;
  grns?: ProcurementGrn[];
  organization?: SysOrganization;
}

export interface ProcurementPurchaseBillCreationAttributes {
  date: string;
  code: string;
  company_id?: string | null;
  project_type_id?: string | null;
  project_id?: string | null;
  supplier_id: string;
  subtotal?: number; // Has default value
  discount?: number; // Has default value
  grand_total?: number; // Has default value
  paid?: number; // Has default value
  due?: number; // Has default value
  note?: string | null;
  attachment?: string | null;
  added_by_id?: number | null;
  approval_layer?: string; // Has default value
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
}

export type ProcurementPurchaseBillUpdateAttributes = Partial<ProcurementPurchaseBillCreationAttributes>;

// Helper type for including relations
export interface ProcurementPurchaseBillWithRelations extends ProcurementPurchaseBillAttributes {
  company?: SysCompany;
  projectType?: ProjectType;
  project?: Project;
  supplier?: SupplierAccounts;
  addedBy?: SysUser;
  grns?: ProcurementGrn[];
  organization?: SysOrganization;
}
