// Auto-generated types for CrmLeadAttachment
// Source: src\database\models\crm\crm_lead_attachment.model.ts

import type { CrmLead } from '../models/crm/crm_lead.model';

export interface CrmLeadAttachmentAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  lead_id: number;
  title: string;
  file_url: string;
  file_type?: string | null;
  file_size?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;

  // Relations
  lead: CrmLead;
}

export interface CrmLeadAttachmentCreationAttributes {
  lead_id: number;
  title: string;
  file_url: string;
  file_type?: string | null;
  file_size?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;
}

export type CrmLeadAttachmentUpdateAttributes = Partial<CrmLeadAttachmentCreationAttributes>;

// Helper type for including relations
export interface CrmLeadAttachmentWithRelations extends CrmLeadAttachmentAttributes {
  lead: CrmLead;
}
