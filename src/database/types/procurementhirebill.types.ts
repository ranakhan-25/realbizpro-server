// Auto-generated types for ProcurementHireBill
// Source: src/database/models/procurement/equipment-hire/pr_hire_bill.model.ts

import type { ProcurementHireOrder } from '../models/procurement/equipment-hire/pr_hire_order.model';
import type { Project } from '../models/projects/project/pr_project.model';
import type { SupplierAccounts } from '../models/projects/contract/pr_supplier_accounts.model';
import type { SysUser } from '../models/system/sys_user.model';
import type { ProcurementHireBillItem } from '../models/procurement/equipment-hire/pr_hire_bill_item.model';
import type { SysOrganization } from '../models/system/sys_organization.model';

export interface ProcurementHireBillAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  bill_no: string;
  hire_order_id: string;
  project_id: string;
  vendor_id: string;
  period_from: string;
  period_to: string;
  subtotal: number;
  vat_total: number;
  ait_tds_total: number;
  discount: number;
  carriage: number;
  net_amount: number;
  status: string;
  notes?: string | null;
  added_by_id?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;

  // Relations
  hireOrder?: ProcurementHireOrder;
  project?: Project;
  vendor?: SupplierAccounts;
  addedBy?: SysUser;
  items?: ProcurementHireBillItem[];
  organization?: SysOrganization;
}

export interface ProcurementHireBillCreationAttributes {
  bill_no: string;
  hire_order_id: string;
  project_id: string;
  vendor_id: string;
  period_from: string;
  period_to: string;
  subtotal?: number; // Has default value
  vat_total?: number; // Has default value
  ait_tds_total?: number; // Has default value
  discount?: number; // Has default value
  carriage?: number; // Has default value
  net_amount?: number; // Has default value
  status?: string; // Has default value
  notes?: string | null;
  added_by_id?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
}

export type ProcurementHireBillUpdateAttributes = Partial<ProcurementHireBillCreationAttributes>;

// Helper type for including relations
export interface ProcurementHireBillWithRelations extends ProcurementHireBillAttributes {
  hireOrder?: ProcurementHireOrder;
  project?: Project;
  vendor?: SupplierAccounts;
  addedBy?: SysUser;
  items?: ProcurementHireBillItem[];
  organization?: SysOrganization;
}
