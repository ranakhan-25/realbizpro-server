// Auto-generated types for CrmLeadCategory
// Source: src/database/models/crm/crm_lead_category.model.ts

import type { CrmLead } from '../models/crm/crm_lead.model';

export interface CrmLeadCategoryAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  name: string;
  code?: string | null;
  description?: string | null;
  is_active: boolean;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;

  // Relations
  leads: CrmLead[];
}

export interface CrmLeadCategoryCreationAttributes {
  name: string;
  code?: string | null;
  description?: string | null;
  is_active?: boolean; // Has default value
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;
}

export type CrmLeadCategoryUpdateAttributes = Partial<CrmLeadCategoryCreationAttributes>;

// Helper type for including relations
export interface CrmLeadCategoryWithRelations extends CrmLeadCategoryAttributes {
  leads: CrmLead[];
}
