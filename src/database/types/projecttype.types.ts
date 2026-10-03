// Auto-generated types for ProjectType
// Source: src\database\models\projects\pr_project_types_model.ts

import { ProjectStatusEnum } from '../models/projects/pr_project_types_model';

export interface ProjectTypeAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  areaId?: string | null;
  code: string;
  name: string;
  projectType?: string | null;
  location?: string | null;
  description?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
  status: ProjectStatusEnum | string;
}

export interface ProjectTypeCreationAttributes {
  areaId?: string | null;
  code: string;
  name: string;
  projectType?: string | null;
  location?: string | null;
  description?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
  status?: ProjectStatusEnum | string; // Has default value
}

export type ProjectTypeUpdateAttributes = Partial<ProjectTypeCreationAttributes>;

// Helper type for including relations
export interface ProjectTypeWithRelations extends ProjectTypeAttributes {
  // No relations defined
}
