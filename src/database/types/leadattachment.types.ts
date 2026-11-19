// Auto-generated types for LeadAttachment
// Source: src/database/models/crm/lead/crm-lead-attachment.model.ts

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Lead } from '../models/crm/lead/crm-lead.model';

export interface LeadAttachmentAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  leadId: number;
  title: string;
  fileUrl: string;
  fileType?: string | null;
  fileSize?: number | null;
  orgId?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;

  // Relations
  organization?: SysOrganization;
  lead?: Lead;
}

export interface LeadAttachmentCreationAttributes {
  leadId: number;
  title: string;
  fileUrl: string;
  fileType?: string | null;
  fileSize?: number | null;
  orgId?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;
}

export type LeadAttachmentUpdateAttributes = Partial<LeadAttachmentCreationAttributes>;

// Helper type for including relations
export interface LeadAttachmentWithRelations extends LeadAttachmentAttributes {
  organization?: SysOrganization;
  lead?: Lead;
}
