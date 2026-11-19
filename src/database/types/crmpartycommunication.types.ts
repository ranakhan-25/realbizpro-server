// Auto-generated types for CrmPartyCommunication
// Source: src/database/models/crm/lead/crm-party-communication.model.ts

import { CrmPartyCommunicationChannel } from '../models/crm/lead/crm-party-communication.model';
import { CrmPartyCommunicationDirection } from '../models/crm/lead/crm-party-communication.model';

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { CrmParty } from '../models/crm/lead/crm-party.model';
import type { SysUser } from '../models/system/sys_user.model';

export interface CrmPartyCommunicationAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  partyUuid: string;
  channel: CrmPartyCommunicationChannel;
  direction: CrmPartyCommunicationDirection;
  occurredAt: Date;
  summary: string;
  orgId?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  loggedByUuid?: string | null;

  // Relations
  organization?: SysOrganization;
  party?: CrmParty;
  loggedBy?: SysUser;
}

export interface CrmPartyCommunicationCreationAttributes {
  partyUuid: string;
  channel: CrmPartyCommunicationChannel;
  direction: CrmPartyCommunicationDirection;
  occurredAt: Date;
  summary: string;
  orgId?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  loggedByUuid?: string | null;
}

export type CrmPartyCommunicationUpdateAttributes = Partial<CrmPartyCommunicationCreationAttributes>;

// Helper type for including relations
export interface CrmPartyCommunicationWithRelations extends CrmPartyCommunicationAttributes {
  organization?: SysOrganization;
  party?: CrmParty;
  loggedBy?: SysUser;
}
