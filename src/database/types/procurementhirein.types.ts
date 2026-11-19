// Auto-generated types for ProcurementHireIn
// Source: src/database/models/procurement/equipment-hire/pr_hire_in.model.ts

import type { ProcurementHireOrder } from '../models/procurement/equipment-hire/pr_hire_order.model';
import type { SysUser } from '../models/system/sys_user.model';
import type { ProcurementHireInItem } from '../models/procurement/equipment-hire/pr_hire_in_item.model';
import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface ProcurementHireInAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  hire_in_no: string;
  hire_order_id: string;
  received_date: string;
  status: string;
  notes?: string | null;
  received_by_id?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;

  // Relations
  hireOrder?: ProcurementHireOrder;
  receivedBy?: SysUser;
  items?: ProcurementHireInItem[];
  organization?: SysOrganization;
  project?: Project;
}

export interface ProcurementHireInCreationAttributes {
  hire_in_no: string;
  hire_order_id: string;
  received_date: string;
  status?: string; // Has default value
  notes?: string | null;
  received_by_id?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;
}

export type ProcurementHireInUpdateAttributes = Partial<ProcurementHireInCreationAttributes>;

// Helper type for including relations
export interface ProcurementHireInWithRelations extends ProcurementHireInAttributes {
  hireOrder?: ProcurementHireOrder;
  receivedBy?: SysUser;
  items?: ProcurementHireInItem[];
  organization?: SysOrganization;
  project?: Project;
}
