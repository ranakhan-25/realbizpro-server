// Auto-generated types for ProcurementHireInItem
// Source: src/database/models/procurement/equipment-hire/pr_hire_in_item.model.ts

import type { ProcurementHireIn } from '../models/procurement/equipment-hire/pr_hire_in.model';
import type { ProcurementHireOrderItem } from '../models/procurement/equipment-hire/pr_hire_order_item.model';
import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface ProcurementHireInItemAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  hire_in_id: string;
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
  hireIn?: ProcurementHireIn;
  hireOrderItem?: ProcurementHireOrderItem;
  organization?: SysOrganization;
  project?: Project;
}

export interface ProcurementHireInItemCreationAttributes {
  hire_in_id: string;
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

export type ProcurementHireInItemUpdateAttributes = Partial<ProcurementHireInItemCreationAttributes>;

// Helper type for including relations
export interface ProcurementHireInItemWithRelations extends ProcurementHireInItemAttributes {
  hireIn?: ProcurementHireIn;
  hireOrderItem?: ProcurementHireOrderItem;
  organization?: SysOrganization;
  project?: Project;
}
