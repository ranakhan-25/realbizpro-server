// Auto-generated types for AcquisitionLead
// Source: src/database/models/lams/acquisition-lead.model.ts

import type { LandOwner } from '../models/lams/land-owner.model';
import type { FollowUp } from '../models/lams/follow-up.model';
import type { NegotiationProcess } from '../models/lams/negotiation-process.model';
import type { LegalDocument } from '../models/lams/legal-document.model';

export interface AcquisitionLeadAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  lead_title: string;
  lead_date: Date;
  land_type: string;
  land_area: number;
  lead_status: string;
  created_by?: number | null;
  added_by?: number | null;
  deleted_by?: number | null;
  org_id?: string | null;

  // Relations
  land_owners?: LandOwner[];
  follow_ups?: FollowUp[];
  negotiation_processes?: NegotiationProcess[];
  legal_documents?: LegalDocument[];
}

export interface AcquisitionLeadCreationAttributes {
  lead_title: string;
  lead_date: Date;
  land_type: string;
  land_area: number;
  lead_status?: string; // Has default value
  created_by?: number | null;
  added_by?: number | null;
  deleted_by?: number | null;
  org_id?: string | null;
}

export type AcquisitionLeadUpdateAttributes = Partial<AcquisitionLeadCreationAttributes>;

// Helper type for including relations
export interface AcquisitionLeadWithRelations extends AcquisitionLeadAttributes {
  land_owners?: LandOwner[];
  follow_ups?: FollowUp[];
  negotiation_processes?: NegotiationProcess[];
  legal_documents?: LegalDocument[];
}
