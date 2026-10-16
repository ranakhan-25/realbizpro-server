// Auto-generated types for CrmLeadSource
// Source: src\database\models\crm\crm_lead_source.model.ts

import type { CrmLead } from '../models/crm/crm_lead.model';

export interface CrmLeadSourceAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  name: string;
  code?: string | null;
  is_active: boolean;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;

  // Relations
  leads: CrmLead[];
}

export interface CrmLeadSourceCreationAttributes {
  name: string;
  code?: string | null;
  is_active?: boolean; // Has default value
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;
}

export type CrmLeadSourceUpdateAttributes = Partial<CrmLeadSourceCreationAttributes>;

// Helper type for including relations
export interface CrmLeadSourceWithRelations extends CrmLeadSourceAttributes {
  leads: CrmLead[];
}
