// Auto-generated types for CrmLeadRequirement
// Source: src\database\models\crm\crm_lead_requirement.model.ts

import type { CrmLead } from '../models/crm/crm_lead.model';

export interface CrmLeadRequirementAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  lead_id: number;
  requirement_type_id?: number | null;
  property_type?: string | null;
  preferred_area?: string | null;
  size_sqft?: number | null;
  budget_min?: number | null;
  budget_max?: number | null;
  features_required?: any | null;
  remarks?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;

  // Relations
  lead: CrmLead;
}

export interface CrmLeadRequirementCreationAttributes {
  lead_id: number;
  requirement_type_id?: number | null;
  property_type?: string | null;
  preferred_area?: string | null;
  size_sqft?: number | null;
  budget_min?: number | null;
  budget_max?: number | null;
  features_required?: any | null;
  remarks?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;
}

export type CrmLeadRequirementUpdateAttributes = Partial<CrmLeadRequirementCreationAttributes>;

// Helper type for including relations
export interface CrmLeadRequirementWithRelations extends CrmLeadRequirementAttributes {
  lead: CrmLead;
}
