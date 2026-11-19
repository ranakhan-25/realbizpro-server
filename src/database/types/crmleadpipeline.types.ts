// Auto-generated types for CrmLeadPipeline
// Source: src/database/models/crm/lead/crm-lead-pipeline.model.ts

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface CrmLeadPipelineAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  projectId: string;
  initialLeadsCount: number;
  estimatedPipelineValue: number;
  orgId?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;

  // Relations
  organization?: SysOrganization;
  project?: Project;
}

export interface CrmLeadPipelineCreationAttributes {
  projectId: string;
  initialLeadsCount?: number; // Has default value
  estimatedPipelineValue?: number; // Has default value
  orgId?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type CrmLeadPipelineUpdateAttributes = Partial<CrmLeadPipelineCreationAttributes>;

// Helper type for including relations
export interface CrmLeadPipelineWithRelations extends CrmLeadPipelineAttributes {
  organization?: SysOrganization;
  project?: Project;
}
