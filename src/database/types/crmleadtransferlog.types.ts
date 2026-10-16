// Auto-generated types for CrmLeadTransferLog
// Source: src/database/models/crm/crm_lead_transfer_log.model.ts

import type { CrmLead } from '../models/crm/crm_lead.model';

export interface CrmLeadTransferLogAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  lead_id: number;
  transferred_from: string;
  transferred_to: string;
  transfer_reason?: string | null;
  transfer_date: Date;
  approved_by?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;

  // Relations
  lead: CrmLead;
}

export interface CrmLeadTransferLogCreationAttributes {
  lead_id: number;
  transferred_from: string;
  transferred_to: string;
  transfer_reason?: string | null;
  transfer_date: Date;
  approved_by?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;
}

export type CrmLeadTransferLogUpdateAttributes = Partial<CrmLeadTransferLogCreationAttributes>;

// Helper type for including relations
export interface CrmLeadTransferLogWithRelations extends CrmLeadTransferLogAttributes {
  lead: CrmLead;
}
