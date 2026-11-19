// Auto-generated types for LeadRequirement
// Source: src/database/models/crm/lead/crm-lead-requirement.model.ts

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Lead } from '../models/crm/lead/crm-lead.model';
import type { LeadRequirementType } from '../models/crm/lead/crm-lead-master-data.model';

export interface LeadRequirementAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  leadId: number;
  requirementTypeId?: number | null;
  propertyType?: string | null;
  preferredArea?: string | null;
  sizeSqft?: number | null;
  budgetMin?: number | null;
  budgetMax?: number | null;
  featuresRequired?: unknown | null;
  remarks?: string | null;
  orgId?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;

  // Relations
  organization?: SysOrganization;
  lead?: Lead;
  requirementType?: LeadRequirementType;
}

export interface LeadRequirementCreationAttributes {
  leadId: number;
  requirementTypeId?: number | null;
  propertyType?: string | null;
  preferredArea?: string | null;
  sizeSqft?: number | null;
  budgetMin?: number | null;
  budgetMax?: number | null;
  featuresRequired?: unknown | null;
  remarks?: string | null;
  orgId?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;
}

export type LeadRequirementUpdateAttributes = Partial<LeadRequirementCreationAttributes>;

// Helper type for including relations
export interface LeadRequirementWithRelations extends LeadRequirementAttributes {
  organization?: SysOrganization;
  lead?: Lead;
  requirementType?: LeadRequirementType;
}
