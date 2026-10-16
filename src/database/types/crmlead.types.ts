// Auto-generated types for CrmLead
// Source: src/database/models/crm/crm_lead.model.ts

import type { CrmLeadCategory } from '../models/crm/crm_lead_category.model';
import type { CrmLeadStage } from '../models/crm/crm_lead_stage.model';
import type { CrmLeadSource } from '../models/crm/crm_lead_source.model';
import type { CrmCampaign } from '../models/crm/crm_campaign.model';
import type { CrmProfession } from '../models/crm/crm_profession.model';
import type { CrmLeadRequirement } from '../models/crm/crm_lead_requirement.model';
import type { CrmLeadPropertyInterest } from '../models/crm/crm_lead_property_interest.model';
import type { CrmLeadActivity } from '../models/crm/crm_lead_activity.model';
import type { CrmLeadAttachment } from '../models/crm/crm_lead_attachment.model';
import type { CrmLeadCallAssign } from '../models/crm/crm_lead_call_assign.model';
import type { CrmLeadTransferLog } from '../models/crm/crm_lead_transfer_log.model';
import type { CrmDealNegotiation } from '../models/crm/crm_deal_negotiation.model';

export interface CrmLeadAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  lead_code: string;
  client_name: string;
  phone: string;
  alternate_phone?: string | null;
  email?: string | null;
  lead_category_id?: number | null;
  lead_stage_id?: number | null;
  lead_source_id?: number | null;
  campaign_id?: number | null;
  profession_id?: number | null;
  designation?: string | null;
  organization?: string | null;
  present_address?: string | null;
  permanent_address?: string | null;
  assigned_to?: string | null;
  priority: string;
  lead_score: number;
  status: string;
  notes?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;

  // Relations
  category: CrmLeadCategory;
  stage: CrmLeadStage;
  source: CrmLeadSource;
  campaign: CrmCampaign;
  profession: CrmProfession;
  requirements: CrmLeadRequirement[];
  property_interests: CrmLeadPropertyInterest[];
  activities: CrmLeadActivity[];
  attachments: CrmLeadAttachment[];
  call_assignments: CrmLeadCallAssign[];
  transfer_logs: CrmLeadTransferLog[];
  negotiations: CrmDealNegotiation[];
}

export interface CrmLeadCreationAttributes {
  lead_code: string;
  client_name: string;
  phone: string;
  alternate_phone?: string | null;
  email?: string | null;
  lead_category_id?: number | null;
  lead_stage_id?: number | null;
  lead_source_id?: number | null;
  campaign_id?: number | null;
  profession_id?: number | null;
  designation?: string | null;
  organization?: string | null;
  present_address?: string | null;
  permanent_address?: string | null;
  assigned_to?: string | null;
  priority?: string; // Has default value
  lead_score?: number; // Has default value
  status?: string; // Has default value
  notes?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;
}

export type CrmLeadUpdateAttributes = Partial<CrmLeadCreationAttributes>;

// Helper type for including relations
export interface CrmLeadWithRelations extends CrmLeadAttributes {
  category: CrmLeadCategory;
  stage: CrmLeadStage;
  source: CrmLeadSource;
  campaign: CrmCampaign;
  profession: CrmProfession;
  requirements: CrmLeadRequirement[];
  property_interests: CrmLeadPropertyInterest[];
  activities: CrmLeadActivity[];
  attachments: CrmLeadAttachment[];
  call_assignments: CrmLeadCallAssign[];
  transfer_logs: CrmLeadTransferLog[];
  negotiations: CrmDealNegotiation[];
}
