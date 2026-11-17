// Auto-generated types for NegotiationProcess
// Source: src\database\models\lams\negotiation-process.model.ts

import type { AcquisitionLead } from '../models/lams/acquisition-lead.model';

export interface NegotiationProcessAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  org_id: string;
  lead_id: any;
  round_no: number;
  negotiation_date: Date | null;
  offered_price: number;
  counter_amount: number;
  gap_amount: number;
  agreed_price: number;
  final_amount: number;
  negotiator?: string | null;
  negotiation_status: string;
  next_meeting_date?: Date | null;
  meeting_notes?: string | null;
  created_by?: number | null;
  added_by?: number | null;
  deleted_by?: number | null;

  // Relations
  acquisition_lead?: AcquisitionLead;
}

export interface NegotiationProcessCreationAttributes {
  org_id: string;
  lead_id: any;
  round_no?: number; // Has default value
  negotiation_date?: Date | null; // Nullable
  offered_price?: number; // Has default value
  counter_amount?: number; // Has default value
  gap_amount?: number; // Has default value
  agreed_price?: number; // Has default value
  final_amount?: number; // Has default value
  negotiator?: string | null;
  negotiation_status?: string; // Has default value
  next_meeting_date?: Date | null;
  meeting_notes?: string | null;
  created_by?: number | null;
  added_by?: number | null;
  deleted_by?: number | null;
}

export type NegotiationProcessUpdateAttributes = Partial<NegotiationProcessCreationAttributes>;

// Helper type for including relations
export interface NegotiationProcessWithRelations extends NegotiationProcessAttributes {
  acquisition_lead?: AcquisitionLead;
}
