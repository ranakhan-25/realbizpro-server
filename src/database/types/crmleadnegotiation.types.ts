// Auto-generated types for CrmLeadNegotiation
// Source: src/database/models/crm/call-center/crm-lead-negotiation.model.ts

import { CrmNegotiationStatus } from '../models/crm/call-center/crm-lead-negotiation.model';

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Lead } from '../models/crm/lead/crm-lead.model';
import type { Project } from '../models/projects/project/pr_project.model';
import type { FlatLand } from '../models/projects/flatland/pr_flatland.model';
import type { SysUser } from '../models/system/sys_user.model';

export interface CrmLeadNegotiationAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  leadId: number;
  projectId?: string | null;
  flatLandId?: string | null;
  clientOfferedPrice: number;
  finalAgreedPrice?: number | null;
  discountAmount?: number | null;
  specialCondition?: string | null;
  status: CrmNegotiationStatus | null;
  orgId?: number | null;
  createdById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  rejectionReason?: string | null;
  approvedById?: string | null;
  approvalDate?: Date | null;
  activityType?: string;
  listedPrice?: number;
  counterPrice?: number;
  discountPercent?: number;
  paymentTerm?: string;
  roundNo?: number;
  note?: string;

  // Relations
  organization?: SysOrganization;
  lead?: Lead;
  project?: Project;
  flatLand?: FlatLand;
  creator?: SysUser;
  approver?: SysUser;
}

export interface CrmLeadNegotiationCreationAttributes {
  leadId: number;
  projectId?: string | null;
  flatLandId?: string | null;
  clientOfferedPrice: number;
  finalAgreedPrice?: number | null;
  discountAmount?: number | null;
  specialCondition?: string | null;
  status?: CrmNegotiationStatus | null; // Has default value
  orgId?: number | null;
  createdById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  rejectionReason?: string | null;
  approvedById?: string | null;
  approvalDate?: Date | null;
  activityType?: string;
  listedPrice?: number;
  counterPrice?: number;
  discountPercent?: number;
  paymentTerm?: string;
  roundNo?: number;
  note?: string;
}

export type CrmLeadNegotiationUpdateAttributes = Partial<CrmLeadNegotiationCreationAttributes>;

// Helper type for including relations
export interface CrmLeadNegotiationWithRelations extends CrmLeadNegotiationAttributes {
  organization?: SysOrganization;
  lead?: Lead;
  project?: Project;
  flatLand?: FlatLand;
  creator?: SysUser;
  approver?: SysUser;
}
