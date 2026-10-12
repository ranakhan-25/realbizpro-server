// Auto-generated types for Site
// Source: src/database/models/projects/project/pr_site.model.ts

import type { Project } from '../models/projects/project/pr_project_model';

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
  projectType?: string | null;
  projectId: number;
  createdBy?: number | null;
  updatedBy?: number | null;
  deletedBy?: number | null;

  // Relations
  project?: Project;
}

export interface SiteCreationAttributes {
  code: string;
  name: string;
  location?: string | null;
  description?: string | null;
  projectType?: string | null;
  projectId: number;
  createdBy?: number | null;
  updatedBy?: number | null;
  deletedBy?: number | null;
}

export type SiteUpdateAttributes = Partial<SiteCreationAttributes>;

// Helper type for including relations
export interface SiteWithRelations extends SiteAttributes {
  project?: Project;
}
