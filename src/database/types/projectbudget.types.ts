// Auto-generated types for ProjectBudget
// Source: src/database/models/projects/project_budget/pr_project_budget_model.ts

import { BudgetCategoryType } from '../models/projects/project_budget/pr_project_budget_model';
import { BudgetStatus } from '../models/projects/project_budget/pr_project_budget_model';

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface ProjectBudgetAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  uid: string;
  projectUuid: string;
  budgetCode: string;
  category: BudgetCategoryType;
  plannedAmount: number;
  revisedAmount?: number | null;
  status: BudgetStatus;
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

export interface ProjectBudgetCreationAttributes {
  uid?: string; // Has default value
  projectUuid: string;
  budgetCode: string;
  category: BudgetCategoryType;
  plannedAmount?: number; // Has default value
  revisedAmount?: number | null;
  status?: BudgetStatus; // Has default value
  addedBy?: string | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;
}

export type ProjectBudgetUpdateAttributes = Partial<ProjectBudgetCreationAttributes>;

// Helper type for including relations
export interface ProjectBudgetWithRelations extends ProjectBudgetAttributes {
  organization?: SysOrganization;
  project?: Project;
}
