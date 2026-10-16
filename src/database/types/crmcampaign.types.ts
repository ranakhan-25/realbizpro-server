// Auto-generated types for CrmCampaign
// Source: src/database/models/crm/crm_campaign.model.ts

import type { CrmLead } from '../models/crm/crm_lead.model';

export interface CrmCampaignAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  name: string;
  start_date?: string | null;
  end_date?: string | null;
  budget?: number | null;
  channel?: string | null;
  status: string;
  description?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;

  // Relations
  leads: CrmLead[];
}

export interface CrmCampaignCreationAttributes {
  name: string;
  start_date?: string | null;
  end_date?: string | null;
  budget?: number | null;
  channel?: string | null;
  status?: string; // Has default value
  description?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;
}

export type CrmCampaignUpdateAttributes = Partial<CrmCampaignCreationAttributes>;

// Helper type for including relations
export interface CrmCampaignWithRelations extends CrmCampaignAttributes {
  leads: CrmLead[];
}
