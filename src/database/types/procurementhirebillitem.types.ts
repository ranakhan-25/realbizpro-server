// Auto-generated types for ProcurementHireBillItem
// Source: src/database/models/procurement/equipment-hire/pr_hire_bill_item.model.ts

import type { ProcurementHireBill } from '../models/procurement/equipment-hire/pr_hire_bill.model';
import type { ProcurementHireOrderItem } from '../models/procurement/equipment-hire/pr_hire_order_item.model';
import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface ProcurementHireBillItemAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  bill_id: string;
  hire_order_item_id: string;
  description: string;
  quantity: number;
  rate: number;
  tax_amount: number;
  vat_amount: number;
  amount: number;
  orgId?: number | null;
  projectId?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;

  // Relations
  bill?: ProcurementHireBill;
  hireOrderItem?: ProcurementHireOrderItem;
  organization?: SysOrganization;
  project?: Project;
}

export interface ProcurementHireBillItemCreationAttributes {
  bill_id: string;
  hire_order_item_id: string;
  description: string;
  quantity: number;
  rate: number;
  tax_amount?: number; // Has default value
  vat_amount?: number; // Has default value
  amount: number;
  orgId?: number | null;
  projectId?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type ProcurementHireBillItemUpdateAttributes = Partial<ProcurementHireBillItemCreationAttributes>;

// Helper type for including relations
export interface ProcurementHireBillItemWithRelations extends ProcurementHireBillItemAttributes {
  bill?: ProcurementHireBill;
  hireOrderItem?: ProcurementHireOrderItem;
  organization?: SysOrganization;
  project?: Project;
}
