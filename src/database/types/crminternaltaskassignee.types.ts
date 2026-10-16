// Auto-generated types for CrmInternalTaskAssignee
// Source: src\database\models\crm\crm_internal_task_assignee.model.ts

import type { CrmInternalTask } from '../models/crm/crm_internal_task.model';

export interface CrmInternalTaskAssigneeAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  task_id: number;
  user_id: string;
  assigned_by?: string | null;
  status: string;
  completed_at?: Date | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;

  // Relations
  task: CrmInternalTask;
}

export interface CrmInternalTaskAssigneeCreationAttributes {
  task_id: number;
  user_id: string;
  assigned_by?: string | null;
  status?: string; // Has default value
  completed_at?: Date | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;
}

export type CrmInternalTaskAssigneeUpdateAttributes = Partial<CrmInternalTaskAssigneeCreationAttributes>;

// Helper type for including relations
export interface CrmInternalTaskAssigneeWithRelations extends CrmInternalTaskAssigneeAttributes {
  task: CrmInternalTask;
}
