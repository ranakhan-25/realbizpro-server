// Auto-generated types for LandOwner
// Source: src/database/models/lams/land-owner.model.ts

import type { AcquisitionLead } from '../models/lams/acquisition-lead.model';

export interface LandOwnerAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  org_id: string;
  lead_id?: any | null;
  owner_type: string;
  name: string;
  father_name?: string | null;
  contact_number?: string | null;
  email?: string | null;
  address?: string | null;
  nid_number?: string | null;
  ownership_percentage?: number | null;
  bank_name?: string | null;
  bank_account?: string | null;
  nominee_json?: any | null;
  created_by?: number | null;
  added_by?: number | null;
  deleted_by?: number | null;

  // Relations
  acquisition_lead?: AcquisitionLead;
}

export interface LandOwnerCreationAttributes {
  org_id: string;
  lead_id?: any | null;
  owner_type?: string; // Has default value
  name: string;
  father_name?: string | null;
  contact_number?: string | null;
  email?: string | null;
  address?: string | null;
  nid_number?: string | null;
  ownership_percentage?: number | null;
  bank_name?: string | null;
  bank_account?: string | null;
  nominee_json?: any | null;
  created_by?: number | null;
  added_by?: number | null;
  deleted_by?: number | null;
}

export type LandOwnerUpdateAttributes = Partial<LandOwnerCreationAttributes>;

// Helper type for including relations
export interface LandOwnerWithRelations extends LandOwnerAttributes {
  acquisition_lead?: AcquisitionLead;
}
