// Auto-generated types for ProjectDocument
// Source: src/database/models/projects/project-document/pr_project_document.model.ts

import type { Project } from '../models/projects/project/pr_project.model';
import type { SysOrganization } from '../models/system/sys_organization.model';

export interface ProjectDocumentAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  projectId: string;
  documentName: string;
  documentType: string;
  details?: string | null;
  rajuk?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;

  // Relations
  project?: Project;
  organization?: SysOrganization;
}

export interface ProjectDocumentCreationAttributes {
  projectId: string;
  documentName: string;
  documentType?: string; // Has default value
  details?: string | null;
  rajuk?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
}

export type ProjectDocumentUpdateAttributes = Partial<ProjectDocumentCreationAttributes>;

// Helper type for including relations
export interface ProjectDocumentWithRelations extends ProjectDocumentAttributes {
  project?: Project;
  organization?: SysOrganization;
}
