// Auto-generated types for CrmInternalTask
// Source: src\database\models\crm\crm_internal_task.model.ts

import type { CrmInternalTaskAssignee } from '../models/crm/crm_internal_task_assignee.model';

export interface CrmInternalTaskAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  task_type_id?: number | null;
  title: string;
  description?: string | null;
  priority: string;
  due_date?: Date | null;
  status: string;
  related_lead_id?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;

  // Relations
  assignees: CrmInternalTaskAssignee[];
}

export interface CrmInternalTaskCreationAttributes {
  task_type_id?: number | null;
  title: string;
  description?: string | null;
  priority?: string; // Has default value
  due_date?: Date | null;
  status?: string; // Has default value
  related_lead_id?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;
}

export type CrmInternalTaskUpdateAttributes = Partial<CrmInternalTaskCreationAttributes>;

// Helper type for including relations
export interface CrmInternalTaskWithRelations extends CrmInternalTaskAttributes {
  assignees: CrmInternalTaskAssignee[];
}
