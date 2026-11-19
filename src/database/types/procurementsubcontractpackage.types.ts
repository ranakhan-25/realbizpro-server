// Auto-generated types for ProcurementSubcontractPackage
// Source: src/database/models/procurement/configuration/subcontract-package/pr_subcontract_package.model.ts

import { SubcontractPackageStatus } from '../models/procurement/configuration/subcontract-package/pr_subcontract_package.model';

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface ProcurementSubcontractPackageAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  name: string;
  unit: string;
  status: SubcontractPackageStatus;
  orgId?: number | null;
  projectId?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;

  // Relations
  organization?: SysOrganization;
  project?: Project;
}

export interface ProcurementSubcontractPackageCreationAttributes {
  name: string;
  unit: string;
  status?: SubcontractPackageStatus; // Has default value
  orgId?: number | null;
  projectId?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type ProcurementSubcontractPackageUpdateAttributes = Partial<ProcurementSubcontractPackageCreationAttributes>;

// Helper type for including relations
export interface ProcurementSubcontractPackageWithRelations extends ProcurementSubcontractPackageAttributes {
  organization?: SysOrganization;
  project?: Project;
}
