// Auto-generated types for ProcurementLaborType
// Source: src/database/models/procurement/configuration/labor-type/pr_labor_type.model.ts

import { LaborTypeStatus } from '../models/procurement/configuration/labor-type/pr_labor_type.model';

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface ProcurementLaborTypeAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  name: string;
  unit: string;
  status: LaborTypeStatus;
  orgId?: number | null;
  projectId?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;

  // Relations
  organization?: SysOrganization;
  project?: Project;
}

export interface ProcurementLaborTypeCreationAttributes {
  name: string;
  unit: string;
  status?: LaborTypeStatus; // Has default value
  orgId?: number | null;
  projectId?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type ProcurementLaborTypeUpdateAttributes = Partial<ProcurementLaborTypeCreationAttributes>;

// Helper type for including relations
export interface ProcurementLaborTypeWithRelations extends ProcurementLaborTypeAttributes {
  organization?: SysOrganization;
  project?: Project;
}
