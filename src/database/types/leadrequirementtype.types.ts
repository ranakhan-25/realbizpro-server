// Auto-generated types for LeadRequirementType
// Source: src/database/models/crm/lead/crm-lead-master-data.model.ts

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { LeadRequirement } from '../models/crm/lead/crm-lead-requirement.model';

export interface LeadRequirementTypeAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  orgId?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;
  name: string;

  // Relations
  organization?: SysOrganization;
  requirements?: LeadRequirement[];
}

export interface LeadRequirementTypeCreationAttributes {
  orgId?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;
  name: string;
}

export type LeadRequirementTypeUpdateAttributes = Partial<LeadRequirementTypeCreationAttributes>;

// Helper type for including relations
export interface LeadRequirementTypeWithRelations extends LeadRequirementTypeAttributes {
  organization?: SysOrganization;
  requirements?: LeadRequirement[];
}
