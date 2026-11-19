// Auto-generated types for LeadTransferLog
// Source: src/database/models/crm/lead/crm-lead-transfer-log.model.ts

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Lead } from '../models/crm/lead/crm-lead.model';
import type { SysUser } from '../models/system/sys_user.model';

export interface LeadTransferLogAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  leadId: number;
  transferredFrom: string;
  transferredTo: string;
  transferReason?: string | null;
  transferDate: Date;
  approvedBy?: string | null;
  transferType?: string | null;
  followup: boolean;
  manualSet: boolean;
  assignedQuantity?: number | null;
  orgId?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;

  // Relations
  organization?: SysOrganization;
  lead?: Lead;
  sourceUser?: SysUser;
  targetUser?: SysUser;
  approver?: SysUser;
}

export interface LeadTransferLogCreationAttributes {
  leadId: number;
  transferredFrom: string;
  transferredTo: string;
  transferReason?: string | null;
  transferDate: Date;
  approvedBy?: string | null;
  transferType?: string | null;
  followup?: boolean; // Has default value
  manualSet?: boolean; // Has default value
  assignedQuantity?: number | null;
  orgId?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;
}

export type LeadTransferLogUpdateAttributes = Partial<LeadTransferLogCreationAttributes>;

// Helper type for including relations
export interface LeadTransferLogWithRelations extends LeadTransferLogAttributes {
  organization?: SysOrganization;
  lead?: Lead;
  sourceUser?: SysUser;
  targetUser?: SysUser;
  approver?: SysUser;
}
