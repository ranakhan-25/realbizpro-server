// Auto-generated types for ProjectTask
// Source: src/database/models/projects/project-task/pr_project-task_model.ts

import { TaskPriority } from '../models/projects/project-task/pr_project-task_model';
import { TaskStatus } from '../models/projects/project-task/pr_project-task_model';

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface ProjectTaskAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  uid?: string | null;
  projectUuid: string;
  milestoneUuid?: string | null;
  taskCode: string;
  title: string;
  assignee: string;
  priority: TaskPriority;
  dueDate: Date;
  reminderBefore?: number | null;
  description?: string | null;
  status: TaskStatus;
  attachmentUrl?: string | null;
  addedBy?: string | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;

  // Relations
  organization?: SysOrganization;
  project?: Project;
}

export interface ProjectTaskCreationAttributes {
  uid?: string | null;
  projectUuid: string;
  milestoneUuid?: string | null;
  taskCode: string;
  title: string;
  assignee: string;
  priority?: TaskPriority; // Has default value
  dueDate: Date;
  reminderBefore?: number | null;
  description?: string | null;
  status?: TaskStatus; // Has default value
  attachmentUrl?: string | null;
  addedBy?: string | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;
}

export type ProjectTaskUpdateAttributes = Partial<ProjectTaskCreationAttributes>;

// Helper type for including relations
export interface ProjectTaskWithRelations extends ProjectTaskAttributes {
  organization?: SysOrganization;
  project?: Project;
}
