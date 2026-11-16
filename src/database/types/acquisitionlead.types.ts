// Auto-generated types for AcquisitionLead
// Source: src\database\models\lams\acquisition-lead.model.ts

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
  org_id: string;
  lead_code?: string | null;
  lead_title: string;
  lead_date: Date;
  land_type: string;
  land_area: number;
  area_katha?: number | null;
  area_sqft?: number | null;
  location?: string | null;
  mouza?: string | null;
  khatian_no?: string | null;
  dag_no?: string | null;
  asking_price?: number | null;
  source?: string | null;
  priority?: string | null;
  lead_status: string;
  assigned_to?: string | null;
  notes?: string | null;
  co_owners_json?: any | null;
  map_url?: string | null;
  created_by?: number | null;
  added_by?: number | null;
  deleted_by?: number | null;

  // Relations
  land_owners?: LandOwner[];
  follow_ups?: FollowUp[];
  negotiation_processes?: NegotiationProcess[];
  legal_documents?: LegalDocument[];
}

export interface AcquisitionLeadCreationAttributes {
  org_id: string;
  lead_code?: string | null;
  lead_title: string;
  lead_date: Date;
  land_type: string;
  land_area: number;
  area_katha?: number | null;
  area_sqft?: number | null;
  location?: string | null;
  mouza?: string | null;
  khatian_no?: string | null;
  dag_no?: string | null;
  asking_price?: number | null;
  source?: string | null;
  priority?: string | null;
  lead_status?: string; // Has default value
  assigned_to?: string | null;
  notes?: string | null;
  co_owners_json?: any | null;
  map_url?: string | null;
  created_by?: number | null;
  added_by?: number | null;
  deleted_by?: number | null;
}

export type AcquisitionLeadUpdateAttributes = Partial<AcquisitionLeadCreationAttributes>;

// Helper type for including relations
export interface AcquisitionLeadWithRelations extends AcquisitionLeadAttributes {
  land_owners?: LandOwner[];
  follow_ups?: FollowUp[];
  negotiation_processes?: NegotiationProcess[];
  legal_documents?: LegalDocument[];
}
