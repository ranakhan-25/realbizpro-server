// Auto-generated types for Project
// Source: src\database\models\projects\pr_project_model.ts

import { ProjectStatusEnum } from '../models/projects/pr_project_model';

export interface ProjectAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  code: string;
  name: string;
  projectType?: string | null;
  areaCategory?: string | null;
  location?: string | null;
  totalBudget?: number | null;
  contactPersonName?: string | null;
  contactPhone?: string | null;
  clientEmail?: string | null;
  contractorCompany?: string | null;
  projectManager?: string | null;
  numberOfStoreys?: number | null;
  startDate?: Date | null;
  endDate?: Date | null;
  progressPercentage?: number | null;
  description?: string | null;
  status: ProjectStatusEnum | string;
}

export interface ProjectCreationAttributes {
  code: string;
  name: string;
  projectType?: string | null;
  areaCategory?: string | null;
  location?: string | null;
  totalBudget?: number | null;
  contactPersonName?: string | null;
  contactPhone?: string | null;
  clientEmail?: string | null;
  contractorCompany?: string | null;
  projectManager?: string | null;
  numberOfStoreys?: number | null;
  startDate?: Date | null;
  endDate?: Date | null;
  progressPercentage?: number | null;
  description?: string | null;
  status?: ProjectStatusEnum | string; // Has default value
}

export type ProjectUpdateAttributes = Partial<ProjectCreationAttributes>;

// Helper type for including relations
export interface ProjectWithRelations extends ProjectAttributes {
  // No relations defined
}
