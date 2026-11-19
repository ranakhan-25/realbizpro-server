// Auto-generated types for ProjectMilestone
// Source: src/database/models/projects/project_milestone/pr_project_milestone_model.ts

import { MilestoneStatus } from '../models/projects/project_milestone/pr_project_milestone_model';

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface ProjectMilestoneAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  projectUuid: string;
  milestoneCode: string;
  milestoneName: string;
  plannedDate: Date;
  actualDate?: Date | null;
  progress: number;
  status: MilestoneStatus;
  varianceDays?: string | null;
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

export interface ProjectMilestoneCreationAttributes {
  projectUuid: string;
  milestoneCode: string;
  milestoneName: string;
  plannedDate: Date;
  actualDate?: Date | null;
  progress?: number; // Has default value
  status?: MilestoneStatus; // Has default value
  varianceDays?: string | null;
  addedBy?: string | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;
}

export type ProjectMilestoneUpdateAttributes = Partial<ProjectMilestoneCreationAttributes>;

// Helper type for including relations
export interface ProjectMilestoneWithRelations extends ProjectMilestoneAttributes {
  organization?: SysOrganization;
  project?: Project;
}
