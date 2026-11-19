// Auto-generated types for ProjectProgress
// Source: src/database/models/projects/project-progress/pr_project-progress_model.ts

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface ProjectProgressAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  uid: string;
  projectUuid: string;
  asOfDate: Date;
  physicalPct: number;
  financialPct: number;
  remarks?: string | null;
  photos?: string[] | null;
  loggedBy: string;
  loggedById: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;

  // Relations
  organization?: SysOrganization;
  project?: Project;
}

export interface ProjectProgressCreationAttributes {
  uid?: string; // Has default value
  projectUuid: string;
  asOfDate: Date;
  physicalPct?: number; // Has default value
  financialPct?: number; // Has default value
  remarks?: string | null;
  photos?: string[] | null;
  loggedBy: string;
  loggedById: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;
}

export type ProjectProgressUpdateAttributes = Partial<ProjectProgressCreationAttributes>;

// Helper type for including relations
export interface ProjectProgressWithRelations extends ProjectProgressAttributes {
  organization?: SysOrganization;
  project?: Project;
}
