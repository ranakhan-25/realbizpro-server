// Auto-generated types for ProjectControl
// Source: src/database/models/projects/project_control/pr_project_control_model.ts

import { ControlType } from '../models/projects/project_control/pr_project_control_model';

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface ProjectControlAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  uid: string;
  projectUuid: string;
  controlCode: string;
  controlType: ControlType;
  thresholdTarget: number;
  actualValue: number;
  actionStep?: string | null;
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

export interface ProjectControlCreationAttributes {
  uid?: string; // Has default value
  projectUuid: string;
  controlCode: string;
  controlType: ControlType;
  thresholdTarget?: number; // Has default value
  actualValue?: number; // Has default value
  actionStep?: string | null;
  addedBy?: string | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;
}

export type ProjectControlUpdateAttributes = Partial<ProjectControlCreationAttributes>;

// Helper type for including relations
export interface ProjectControlWithRelations extends ProjectControlAttributes {
  organization?: SysOrganization;
  project?: Project;
}
