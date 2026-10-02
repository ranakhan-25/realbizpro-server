// Auto-generated types for Project
// Source: src\database\models\projects\pr_project_types_model.ts

import { ProjectStatusEnum } from '../models/projects/pr_project_types_model';

export interface ProjectAttributes {
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

export interface ProjectCreationAttributes {
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

export type ProjectUpdateAttributes = Partial<ProjectCreationAttributes>;

// Helper type for including relations
export interface ProjectWithRelations extends ProjectAttributes {
  // No relations defined
}
