// Auto-generated types for CommunicationStatus
// Source: src/database/models/crm/configuration/crm-communication-status.model.ts

import { CommunicationStatusState } from '../models/crm/configuration/crm-communication-status.model';

import type { LeadStage } from '../models/crm/configuration/crm-lead-stage.model';
import type { SysOrganization } from '../models/system/sys_organization.model';

export interface CommunicationStatusAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  name: string;
  status: CommunicationStatusState;
  description?: string | null;
  isDefault: boolean;
  leadStageId?: string | null;
  orgId?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  addedById?: string | null;

  // Relations
  leadStage?: LeadStage;
  organization?: SysOrganization;
}

export interface CommunicationStatusCreationAttributes {
  name: string;
  status?: CommunicationStatusState; // Has default value
  description?: string | null;
  isDefault?: boolean; // Has default value
  leadStageId?: string | null;
  orgId?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  addedById?: string | null;
}

export type CommunicationStatusUpdateAttributes = Partial<CommunicationStatusCreationAttributes>;

// Helper type for including relations
export interface CommunicationStatusWithRelations extends CommunicationStatusAttributes {
  leadStage?: LeadStage;
  organization?: SysOrganization;
}
