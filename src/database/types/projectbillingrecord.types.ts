// Auto-generated types for ProjectBillingRecord
// Source: src/database/models/projects/billing/pr_project_billing_record.model.ts

import { ProjectBillingResource } from '../models/projects/billing/pr_project_billing_record.model';

import type { Project } from '../models/projects/project/pr_project.model';

export interface ProjectBillingRecordAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  resource: ProjectBillingResource;
  projectId: string;
  code?: string | null;
  title: string;
  recordDate?: Date | null;
  amount: number;
  status: string;
  description?: string | null;
  details: Record<string, unknown>;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;

  // Relations
  project?: Project;
}

export interface ProjectBillingRecordCreationAttributes {
  resource: ProjectBillingResource;
  projectId: string;
  code?: string | null;
  title: string;
  recordDate?: Date | null;
  amount?: number; // Has default value
  status?: string; // Has default value
  description?: string | null;
  details?: Record<string, unknown>; // Has default value
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type ProjectBillingRecordUpdateAttributes = Partial<ProjectBillingRecordCreationAttributes>;

// Helper type for including relations
export interface ProjectBillingRecordWithRelations extends ProjectBillingRecordAttributes {
  project?: Project;
}
