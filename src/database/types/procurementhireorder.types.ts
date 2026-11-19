// Auto-generated types for ProcurementHireOrder
// Source: src/database/models/procurement/equipment-hire/pr_hire_order.model.ts

import { HireOrderMode } from '../models/procurement/equipment-hire/pr_hire_order.model';
import { HireOrderStatus } from '../models/procurement/equipment-hire/pr_hire_order.model';

import type { ProcurementAssetRequisition } from '../models/procurement/requisition/pr_asset_requisition.model';
import type { Project } from '../models/projects/project/pr_project.model';
import type { Site } from '../models/projects/project-site/pr_project_site.model';
import type { SupplierAccounts } from '../models/projects/contract/pr_supplier_accounts.model';
import type { SysUser } from '../models/system/sys_user.model';
import type { ProcurementHireOrderItem } from '../models/procurement/equipment-hire/pr_hire_order_item.model';
import type { ProcurementHireIn } from '../models/procurement/equipment-hire/pr_hire_in.model';
import type { ProcurementHireOut } from '../models/procurement/equipment-hire/pr_hire_out.model';
import type { ProcurementHireBill } from '../models/procurement/equipment-hire/pr_hire_bill.model';
import type { SysOrganization } from '../models/system/sys_organization.model';

export interface ProcurementHireOrderAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  hire_no: string;
  hire_mode: HireOrderMode;
  requisition_id?: string | null;
  project_id: string;
  site_id?: string | null;
  vendor_id: string;
  hire_from: string;
  hire_to?: string | null;
  shipping_cost: number;
  order_discount: number;
  subtotal: number;
  vat_total: number;
  ait_tds_total: number;
  grand_total: number;
  notes?: string | null;
  status: HireOrderStatus;
  added_by_id?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;

  // Relations
  requisition?: ProcurementAssetRequisition;
  project?: Project;
  site?: Site;
  vendor?: SupplierAccounts;
  addedBy?: SysUser;
  items?: ProcurementHireOrderItem[];
  hireIns?: ProcurementHireIn[];
  hireOuts?: ProcurementHireOut[];
  bills?: ProcurementHireBill[];
  organization?: SysOrganization;
}

export interface ProcurementHireOrderCreationAttributes {
  hire_no: string;
  hire_mode: HireOrderMode;
  requisition_id?: string | null;
  project_id: string;
  site_id?: string | null;
  vendor_id: string;
  hire_from: string;
  hire_to?: string | null;
  shipping_cost?: number; // Has default value
  order_discount?: number; // Has default value
  subtotal?: number; // Has default value
  vat_total?: number; // Has default value
  ait_tds_total?: number; // Has default value
  grand_total?: number; // Has default value
  notes?: string | null;
  status?: HireOrderStatus; // Has default value
  added_by_id?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
}

export type ProcurementHireOrderUpdateAttributes = Partial<ProcurementHireOrderCreationAttributes>;

// Helper type for including relations
export interface ProcurementHireOrderWithRelations extends ProcurementHireOrderAttributes {
  requisition?: ProcurementAssetRequisition;
  project?: Project;
  site?: Site;
  vendor?: SupplierAccounts;
  addedBy?: SysUser;
  items?: ProcurementHireOrderItem[];
  hireIns?: ProcurementHireIn[];
  hireOuts?: ProcurementHireOut[];
  bills?: ProcurementHireBill[];
  organization?: SysOrganization;
}
