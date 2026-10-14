// Auto-generated types for Project
// Source: src\database\models\projects\project\pr_project_model.ts

import { ProjectStatus } from '../models/projects/project/pr_project_model';

import type { ShareConfiguration } from '../models/projects/investor/configuration_model';

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
  description?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
  contactPersonName?: string | null;
  contactPhone?: string | null;
  clientEmail?: string | null;
  contractorCompany?: string | null;
  projectManager?: string | null;
  totalBudget?: number | null;
  numberOfStoreys?: number | null;
  progressPercentage?: number | null;
  status: ProjectStatus;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;

  // Relations
  shareConfigurations?: ShareConfiguration[];
}

export interface ProjectCreationAttributes {
  code: string;
  name: string;
  projectType?: string | null;
  areaCategory?: string | null;
  location?: string | null;
  description?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
  contactPersonName?: string | null;
  contactPhone?: string | null;
  clientEmail?: string | null;
  contractorCompany?: string | null;
  projectManager?: string | null;
  totalBudget?: number | null;
  numberOfStoreys?: number | null;
  progressPercentage?: number | null;
  status?: ProjectStatus; // Has default value
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type ProjectUpdateAttributes = Partial<ProjectCreationAttributes>;

// Helper type for including relations
export interface ProjectWithRelations extends ProjectAttributes {
  shareConfigurations?: ShareConfiguration[];
}
