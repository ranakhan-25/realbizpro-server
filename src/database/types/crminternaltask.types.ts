// Auto-generated types for CrmInternalTask
// Source: src/database/models/crm/configuration/crm-task-type.model.ts

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { TaskType } from '../models/crm/configuration/crm-task-type.model';
import type { Lead } from '../models/crm/lead/crm-lead.model';
import type { CrmInternalTaskAssignee } from '../models/crm/configuration/crm-task-type.model';

export interface CrmInternalTaskAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  taskTypeId?: number | null;
  title: string;
  description?: string | null;
  priority?: string | null;
  dueDate?: Date | null;
  status?: string | null;
  relatedLeadId?: number | null;
  orgId?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;

  // Relations
  organization?: SysOrganization;
  taskType?: TaskType;
  lead?: Lead;
  assignees?: CrmInternalTaskAssignee[];
}

export interface CrmInternalTaskCreationAttributes {
  taskTypeId?: number | null;
  title: string;
  description?: string | null;
  priority?: string | null;
  dueDate?: Date | null;
  status?: string | null;
  relatedLeadId?: number | null;
  orgId?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;
}

export type CrmInternalTaskUpdateAttributes = Partial<CrmInternalTaskCreationAttributes>;

// Helper type for including relations
export interface CrmInternalTaskWithRelations extends CrmInternalTaskAttributes {
  organization?: SysOrganization;
  taskType?: TaskType;
  lead?: Lead;
  assignees?: CrmInternalTaskAssignee[];
}
