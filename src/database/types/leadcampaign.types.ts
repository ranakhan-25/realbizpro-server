// Auto-generated types for LeadCampaign
// Source: src/database/models/crm/lead/crm-lead-master-data.model.ts

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { LeadSource } from '../models/crm/lead/crm-lead-master-data.model';
import type { Lead } from '../models/crm/lead/crm-lead.model';

export interface LeadCampaignAttributes {
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
  leadSourceId?: number | null;
  startDate?: string | null;
  endDate?: string | null;
  budget?: number | null;
  channel?: string | null;
  status?: string | null;
  description?: string | null;
  formId?: string | null;

  // Relations
  organization?: SysOrganization;
  leadSource?: LeadSource;
  leads?: Lead[];
}

export interface LeadCampaignCreationAttributes {
  orgId?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;
  name: string;
  leadSourceId?: number | null;
  startDate?: string | null;
  endDate?: string | null;
  budget?: number | null;
  channel?: string | null;
  status?: string | null;
  description?: string | null;
  formId?: string | null;
}

export type LeadCampaignUpdateAttributes = Partial<LeadCampaignCreationAttributes>;

// Helper type for including relations
export interface LeadCampaignWithRelations extends LeadCampaignAttributes {
  organization?: SysOrganization;
  leadSource?: LeadSource;
  leads?: Lead[];
}
