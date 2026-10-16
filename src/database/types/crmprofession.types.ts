// Auto-generated types for CrmProfession
// Source: src/database/models/crm/crm_profession.model.ts

import type { CrmLead } from '../models/crm/crm_lead.model';

export interface CrmProfessionAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  name: string;
  description?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;

  // Relations
  leads: CrmLead[];
}

export interface CrmProfessionCreationAttributes {
  name: string;
  description?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;
}

export type CrmProfessionUpdateAttributes = Partial<CrmProfessionCreationAttributes>;

// Helper type for including relations
export interface CrmProfessionWithRelations extends CrmProfessionAttributes {
  leads: CrmLead[];
}
