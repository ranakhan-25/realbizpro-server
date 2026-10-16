// Auto-generated types for CrmLeadActivity
// Source: src\database\models\crm\crm_lead_activity.model.ts

import type { CrmLead } from '../models/crm/crm_lead.model';

export interface CrmLeadActivityAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  lead_id: number;
  activity_type: string;
  activity_date: Date;
  summary: string;
  discussion_points?: string | null;
  next_followup_date?: Date | null;
  visit_place_id?: number | null;
  visit_status_id?: number | null;
  feedback?: string | null;
  conducted_by?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;

  // Relations
  lead: CrmLead;
}

export interface CrmLeadActivityCreationAttributes {
  lead_id: number;
  activity_type: string;
  activity_date: Date;
  summary: string;
  discussion_points?: string | null;
  next_followup_date?: Date | null;
  visit_place_id?: number | null;
  visit_status_id?: number | null;
  feedback?: string | null;
  conducted_by?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;
}

export type CrmLeadActivityUpdateAttributes = Partial<CrmLeadActivityCreationAttributes>;

// Helper type for including relations
export interface CrmLeadActivityWithRelations extends CrmLeadActivityAttributes {
  lead: CrmLead;
}
