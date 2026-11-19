// Auto-generated types for TaskType
// Source: src/database/models/crm/configuration/crm-task-type.model.ts

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { CrmInternalTask } from '../models/crm/configuration/crm-task-type.model';

export interface TaskTypeAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  name: string;
  code?: string | null;
  orgId?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;

  // Relations
  organization?: SysOrganization;
  tasks?: CrmInternalTask[];
}

export interface TaskTypeCreationAttributes {
  name: string;
  code?: string | null;
  orgId?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;
}

export type TaskTypeUpdateAttributes = Partial<TaskTypeCreationAttributes>;

// Helper type for including relations
export interface TaskTypeWithRelations extends TaskTypeAttributes {
  organization?: SysOrganization;
  tasks?: CrmInternalTask[];
}
