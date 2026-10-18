// Auto-generated types for CrmLeadStage
// Source: src\database\models\crm\crm_lead_stage.model.ts

import type { CrmLead } from '../models/crm/crm_lead.model';

export interface CrmLeadStageAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  name: string;
  order: number;
  color?: string | null;
  is_system: boolean;
  is_active: boolean;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;

  // Relations
  leads: CrmLead[];
}

export interface CrmLeadStageCreationAttributes {
  name: string;
  order?: number; // Has default value
  color?: string | null;
  is_system?: boolean; // Has default value
  is_active?: boolean; // Has default value
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;
}

export type CrmLeadStageUpdateAttributes = Partial<CrmLeadStageCreationAttributes>;

// Helper type for including relations
export interface CrmLeadStageWithRelations extends CrmLeadStageAttributes {
  leads: CrmLead[];
}
