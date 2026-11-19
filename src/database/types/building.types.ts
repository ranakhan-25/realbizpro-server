// Auto-generated types for Building
// Source: src/database/models/projects/building/pr_building_model.ts

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface BuildingAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  uid?: string | null;
  buildingCode: string;
  buildingName: string;
  floorsCount: number;
  unitsCount: number;
  status: string;
  siteUid: string;
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

export interface BuildingCreationAttributes {
  uid?: string | null;
  buildingCode: string;
  buildingName: string;
  floorsCount?: number; // Has default value
  unitsCount?: number; // Has default value
  status: string;
  siteUid: string;
  addedBy?: string | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;
}

export type BuildingUpdateAttributes = Partial<BuildingCreationAttributes>;

// Helper type for including relations
export interface BuildingWithRelations extends BuildingAttributes {
  organization?: SysOrganization;
  project?: Project;
}
