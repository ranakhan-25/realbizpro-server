// Auto-generated types for LandOwner
// Source: src\database\models\lams\land-owner.model.ts

import type { AcquisitionLead } from '../models/lams/acquisition-lead.model';

export interface LandOwnerAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  lead_id: any;
  owner_type: string;
  name: string;
  contact_number: string;
  email: string;
  address: string;
  nid_number: string;
  ownership_percentage: number;
  created_by?: number | null;
  added_by?: number | null;
  deleted_by?: number | null;
  projectId?: string | null;

  // Relations
  acquisition_lead?: AcquisitionLead;
}

export interface LandOwnerCreationAttributes {
  lead_id: any;
  owner_type: string;
  name: string;
  contact_number: string;
  email: string;
  address: string;
  nid_number: string;
  ownership_percentage: number;
  created_by?: number | null;
  added_by?: number | null;
  deleted_by?: number | null;
  projectId?: string | null;
}

export type LandOwnerUpdateAttributes = Partial<LandOwnerCreationAttributes>;

// Helper type for including relations
export interface LandOwnerWithRelations extends LandOwnerAttributes {
  acquisition_lead?: AcquisitionLead;
}
