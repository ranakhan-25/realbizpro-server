// Auto-generated types for ProjectShareConfiguration
// Source: src\database\models\projects\project-share-configuration\pr_project_share_configuration.model.ts

import type { Project } from '../models/projects/project/pr_project.model';
import type { SysOrganization } from '../models/system/sys_organization.model';

export interface ProjectShareConfigurationAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  projectId: string;
  titleName: string;
  shareType: string;
  taskNames?: string | null;
  assignType: string;
  configurationAmount: number;
  status: 'active' | 'inactive';
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;

  // Relations
  project?: Project;
  organization?: SysOrganization;
}

export interface ProjectShareConfigurationCreationAttributes {
  projectId: string;
  titleName: string;
  shareType: string;
  taskNames?: string | null;
  assignType: string;
  configurationAmount?: number; // Has default value
  status?: 'active' | 'inactive'; // Has default value
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
}

export type ProjectShareConfigurationUpdateAttributes = Partial<ProjectShareConfigurationCreationAttributes>;

// Helper type for including relations
export interface ProjectShareConfigurationWithRelations extends ProjectShareConfigurationAttributes {
  project?: Project;
  organization?: SysOrganization;
}
