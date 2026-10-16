// Auto-generated types for CrmLeadPropertyInterest
// Source: src/database/models/crm/crm_lead_property_interest.model.ts

import type { CrmLead } from '../models/crm/crm_lead.model';

export interface CrmLeadPropertyInterestAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  lead_id: number;
  project_name?: string | null;
  plot_flat_no?: string | null;
  size?: string | null;
  quoted_price?: number | null;
  client_offered_price?: number | null;
  status: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;

  // Relations
  lead: CrmLead;
}

export interface CrmLeadPropertyInterestCreationAttributes {
  lead_id: number;
  project_name?: string | null;
  plot_flat_no?: string | null;
  size?: string | null;
  quoted_price?: number | null;
  client_offered_price?: number | null;
  status?: string; // Has default value
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;
}

export type CrmLeadPropertyInterestUpdateAttributes = Partial<CrmLeadPropertyInterestCreationAttributes>;

// Helper type for including relations
export interface CrmLeadPropertyInterestWithRelations extends CrmLeadPropertyInterestAttributes {
  lead: CrmLead;
}
