// Auto-generated types for ProcurementHireOutItem
// Source: src/database/models/procurement/equipment-hire/pr_hire_out_item.model.ts

import type { ProcurementHireOut } from '../models/procurement/equipment-hire/pr_hire_out.model';
import type { ProcurementHireOrderItem } from '../models/procurement/equipment-hire/pr_hire_order_item.model';
import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface ProcurementHireOutItemAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  hire_out_id: string;
  hire_order_item_id: string;
  quantity: number;
  condition: string;
  remarks?: string | null;
  orgId?: number | null;
  projectId?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;

  // Relations
  hireOut?: ProcurementHireOut;
  hireOrderItem?: ProcurementHireOrderItem;
  organization?: SysOrganization;
  project?: Project;
}

export interface ProcurementHireOutItemCreationAttributes {
  hire_out_id: string;
  hire_order_item_id: string;
  quantity: number;
  condition?: string; // Has default value
  remarks?: string | null;
  orgId?: number | null;
  projectId?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type ProcurementHireOutItemUpdateAttributes = Partial<ProcurementHireOutItemCreationAttributes>;

// Helper type for including relations
export interface ProcurementHireOutItemWithRelations extends ProcurementHireOutItemAttributes {
  hireOut?: ProcurementHireOut;
  hireOrderItem?: ProcurementHireOrderItem;
  organization?: SysOrganization;
  project?: Project;
}
