// Auto-generated types for CrmInternalTaskAssignee
// Source: src/database/models/crm/configuration/crm-task-type.model.ts

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { CrmInternalTask } from '../models/crm/configuration/crm-task-type.model';
import type { SysUser } from '../models/system/sys_user.model';

export interface CrmInternalTaskAssigneeAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  taskId: number;
  userId: string;
  assignedBy?: string | null;
  status?: string | null;
  completedAt?: Date | null;
  orgId?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;

  // Relations
  organization?: SysOrganization;
  task?: CrmInternalTask;
  assignedUser?: SysUser;
}

export interface CrmInternalTaskAssigneeCreationAttributes {
  taskId: number;
  userId: string;
  assignedBy?: string | null;
  status?: string | null;
  completedAt?: Date | null;
  orgId?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;
}

export type CrmInternalTaskAssigneeUpdateAttributes = Partial<CrmInternalTaskAssigneeCreationAttributes>;

// Helper type for including relations
export interface CrmInternalTaskAssigneeWithRelations extends CrmInternalTaskAssigneeAttributes {
  organization?: SysOrganization;
  task?: CrmInternalTask;
  assignedUser?: SysUser;
}
