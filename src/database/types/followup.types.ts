// Auto-generated types for FollowUp
// Source: src\database\models\lams\follow-up.model.ts

import type { AcquisitionLead } from '../models/lams/acquisition-lead.model';

export interface FollowUpAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  lead_id: any;
  follow_up_date: Date;
  follow_up_type: string;
  outcome: string;
  next_action_date: Date;
  remarks: string;
  created_by?: number | null;
  added_by?: number | null;
  deleted_by?: number | null;
  org_id?: string | null;

  // Relations
  acquisition_lead?: AcquisitionLead;
}

export interface FollowUpCreationAttributes {
  lead_id: any;
  follow_up_date: Date;
  follow_up_type: string;
  outcome: string;
  next_action_date: Date;
  remarks: string;
  created_by?: number | null;
  added_by?: number | null;
  deleted_by?: number | null;
  org_id?: string | null;
}

export type FollowUpUpdateAttributes = Partial<FollowUpCreationAttributes>;

// Helper type for including relations
export interface FollowUpWithRelations extends FollowUpAttributes {
  acquisition_lead?: AcquisitionLead;
}
