// Auto-generated types for CrmPartyAssignment
// Source: src/database/models/crm/lead/crm-party-assignment.model.ts

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { CrmParty } from '../models/crm/lead/crm-party.model';
import type { SysUser } from '../models/system/sys_user.model';

export interface CrmPartyAssignmentAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  partyUuid: string;
  assigneeUuid: string;
  assignedByUuid?: string | null;
  note?: string | null;
  orgId?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;

  // Relations
  organization?: SysOrganization;
  party?: CrmParty;
  assignee?: SysUser;
  assignedBy?: SysUser;
}

export interface CrmPartyAssignmentCreationAttributes {
  partyUuid: string;
  assigneeUuid: string;
  assignedByUuid?: string | null;
  note?: string | null;
  orgId?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type CrmPartyAssignmentUpdateAttributes = Partial<CrmPartyAssignmentCreationAttributes>;

// Helper type for including relations
export interface CrmPartyAssignmentWithRelations extends CrmPartyAssignmentAttributes {
  organization?: SysOrganization;
  party?: CrmParty;
  assignee?: SysUser;
  assignedBy?: SysUser;
}
