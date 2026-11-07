// Auto-generated types for NegotiationProcess
// Source: src/database/models/lams/negotiation-process.model.ts

import type { AcquisitionLead } from '../models/lams/acquisition-lead.model';

export interface NegotiationProcessAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  lead_id: any;
  negotiation_date: Date;
  offered_price: number;
  agreed_price: number;
  negotiation_status: string;
  next_meeting_date: Date;
  meeting_notes: string;
  created_by?: number | null;
  added_by?: number | null;
  deleted_by?: number | null;
  org_id?: string | null;

  // Relations
  acquisition_lead?: AcquisitionLead;
}

export interface NegotiationProcessCreationAttributes {
  lead_id: any;
  negotiation_date: Date;
  offered_price: number;
  agreed_price: number;
  negotiation_status?: string; // Has default value
  next_meeting_date: Date;
  meeting_notes: string;
  created_by?: number | null;
  added_by?: number | null;
  deleted_by?: number | null;
  org_id?: string | null;
}

export type NegotiationProcessUpdateAttributes = Partial<NegotiationProcessCreationAttributes>;

// Helper type for including relations
export interface NegotiationProcessWithRelations extends NegotiationProcessAttributes {
  acquisition_lead?: AcquisitionLead;
}
