// Auto-generated types for ProcurementHireOut
// Source: src/database/models/procurement/equipment-hire/pr_hire_out.model.ts

import type { ProcurementHireOrder } from '../models/procurement/equipment-hire/pr_hire_order.model';
import type { SysUser } from '../models/system/sys_user.model';
import type { ProcurementHireOutItem } from '../models/procurement/equipment-hire/pr_hire_out_item.model';
import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface ProcurementHireOutAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  hire_out_no: string;
  hire_order_id: string;
  return_date: string;
  status: string;
  notes?: string | null;
  returned_by_id?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;

  // Relations
  hireOrder?: ProcurementHireOrder;
  returnedBy?: SysUser;
  items?: ProcurementHireOutItem[];
  organization?: SysOrganization;
  project?: Project;
}

export interface ProcurementHireOutCreationAttributes {
  hire_out_no: string;
  hire_order_id: string;
  return_date: string;
  status?: string; // Has default value
  notes?: string | null;
  returned_by_id?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;
}

export type ProcurementHireOutUpdateAttributes = Partial<ProcurementHireOutCreationAttributes>;

// Helper type for including relations
export interface ProcurementHireOutWithRelations extends ProcurementHireOutAttributes {
  hireOrder?: ProcurementHireOrder;
  returnedBy?: SysUser;
  items?: ProcurementHireOutItem[];
  organization?: SysOrganization;
  project?: Project;
}
