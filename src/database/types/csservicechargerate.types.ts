// Auto-generated types for CsServiceChargeRate
// Source: src/database/models/customer-service/cs_service_charge_rate.model.ts

import { RateBasis } from '../models/customer-service/cs_service_charge.types';

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface CsServiceChargeRateAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  organizationId: number;
  createdBy?: number | null;
  updatedBy?: number | null;
  deletedBy?: number | null;
  projectId: string;
  rateBasis: RateBasis;
  ratePerSqft: number;
  fixedRatePerFlat: number;
  dueDayOfMonth: number;
  notes?: string | null;

  // Relations
  organization?: SysOrganization;
  project?: Project;
}

export interface CsServiceChargeRateCreationAttributes {
  organizationId: number;
  createdBy?: number | null;
  updatedBy?: number | null;
  deletedBy?: number | null;
  projectId: string;
  rateBasis?: RateBasis; // Has default value
  ratePerSqft?: number; // Has default value
  fixedRatePerFlat?: number; // Has default value
  dueDayOfMonth?: number; // Has default value
  notes?: string | null;
}

export type CsServiceChargeRateUpdateAttributes = Partial<CsServiceChargeRateCreationAttributes>;

// Helper type for including relations
export interface CsServiceChargeRateWithRelations extends CsServiceChargeRateAttributes {
  organization?: SysOrganization;
  project?: Project;
}
