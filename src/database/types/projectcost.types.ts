// Auto-generated types for ProjectCost
// Source: src/database/models/projects/project_cost/pr_project_cost_model.ts

import { CostHeadType } from '../models/projects/project_cost/pr_project_cost_model';
import { CostRefType } from '../models/projects/project_cost/pr_project_cost_model';

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface ProjectCostAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  uid: string;
  projectUuid: string;
  costCode: string;
  costHead: CostHeadType;
  amount: number;
  incurredAt: Date;
  refType: CostRefType;
  refUuid?: string | null;
  refNo?: string | null;
  description?: string | null;
  attachmentUrl?: string | null;
  approvedBy?: string | null;
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

export interface ProjectCostCreationAttributes {
  uid?: string; // Has default value
  projectUuid: string;
  costCode: string;
  costHead: CostHeadType;
  amount?: number; // Has default value
  incurredAt: Date;
  refType: CostRefType;
  refUuid?: string | null;
  refNo?: string | null;
  description?: string | null;
  attachmentUrl?: string | null;
  approvedBy?: string | null;
  addedBy?: string | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;
}

export type ProjectCostUpdateAttributes = Partial<ProjectCostCreationAttributes>;

// Helper type for including relations
export interface ProjectCostWithRelations extends ProjectCostAttributes {
  organization?: SysOrganization;
  project?: Project;
}
