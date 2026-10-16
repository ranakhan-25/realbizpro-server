// Auto-generated types for Site
// Source: src/database/models/projects/project-site/pr_project_site.model.ts

import type { Project } from '../models/projects/project/pr_project.model';
import type { MaterialRequisition } from '../models/projects/material-requisition/pr_material_requisition.model';
import type { ProjectShareAssignment } from '../models/projects/project-share-assignment/pr_project_share_assignment.model';

export interface SiteAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  code: string;
  name: string;
  location?: string | null;
  description?: string | null;
  projectId: string;
  createdBy?: number | null;
  updatedBy?: number | null;
  deletedBy?: number | null;

  // Relations
  project?: Project;
  materialRequisitions?: MaterialRequisition[];
  shareAssignments?: ProjectShareAssignment[];
}

export interface SiteCreationAttributes {
  code: string;
  name: string;
  location?: string | null;
  description?: string | null;
  projectId: string;
  createdBy?: number | null;
  updatedBy?: number | null;
  deletedBy?: number | null;
}

export type SiteUpdateAttributes = Partial<SiteCreationAttributes>;

// Helper type for including relations
export interface SiteWithRelations extends SiteAttributes {
  project?: Project;
  materialRequisitions?: MaterialRequisition[];
  shareAssignments?: ProjectShareAssignment[];
}
