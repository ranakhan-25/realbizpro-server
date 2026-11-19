// Auto-generated types for CrmParty
// Source: src/database/models/crm/lead/crm-party.model.ts

import { CrmPartyType } from '../models/crm/lead/crm-party.model';
import { CrmPartyStatus } from '../models/crm/lead/crm-party.model';

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { SysUser } from '../models/system/sys_user.model';
import type { CrmPartyAssignment } from '../models/crm/lead/crm-party-assignment.model';
import type { CrmPartyCommunication } from '../models/crm/lead/crm-party-communication.model';

export interface CrmPartyAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  name: string;
  phone: string;
  email?: string | null;
  nidNumber?: string | null;
  partyType: CrmPartyType;
  address?: string | null;
  tags?: string | null;
  status: CrmPartyStatus;
  orgId?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  assignedToUuid?: string | null;
  createdByUuid?: string | null;
  updatedByUuid?: string | null;
  deletedByUuid?: string | null;

  // Relations
  organization?: SysOrganization;
  assignee?: SysUser;
  creator?: SysUser;
  assignments?: CrmPartyAssignment[];
  communications?: CrmPartyCommunication[];
}

export interface CrmPartyCreationAttributes {
  name: string;
  phone: string;
  email?: string | null;
  nidNumber?: string | null;
  partyType: CrmPartyType;
  address?: string | null;
  tags?: string | null;
  status?: CrmPartyStatus; // Has default value
  orgId?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  assignedToUuid?: string | null;
  createdByUuid?: string | null;
  updatedByUuid?: string | null;
  deletedByUuid?: string | null;
}

export type CrmPartyUpdateAttributes = Partial<CrmPartyCreationAttributes>;

// Helper type for including relations
export interface CrmPartyWithRelations extends CrmPartyAttributes {
  organization?: SysOrganization;
  assignee?: SysUser;
  creator?: SysUser;
  assignments?: CrmPartyAssignment[];
  communications?: CrmPartyCommunication[];
}
