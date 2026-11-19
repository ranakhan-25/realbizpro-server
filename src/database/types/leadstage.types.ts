// Auto-generated types for LeadStage
// Source: src/database/models/crm/configuration/crm-lead-stage.model.ts

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { CommunicationStatus } from '../models/crm/configuration/crm-communication-status.model';
import type { Lead } from '../models/crm/lead/crm-lead.model';

export interface LeadStageAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  name: string;
  isActive: boolean;
  sortOrder: number;
  color?: string | null;
  salesProbability?: number | null;
  isSystem: boolean;
  orgId?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;

  // Relations
  organization?: SysOrganization;
  communicationStatuses?: CommunicationStatus[];
  leads?: Lead[];
}

export interface LeadStageCreationAttributes {
  name: string;
  isActive?: boolean; // Has default value
  sortOrder?: number; // Has default value
  color?: string | null;
  salesProbability?: number | null;
  isSystem?: boolean; // Has default value
  orgId?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type LeadStageUpdateAttributes = Partial<LeadStageCreationAttributes>;

// Helper type for including relations
export interface LeadStageWithRelations extends LeadStageAttributes {
  organization?: SysOrganization;
  communicationStatuses?: CommunicationStatus[];
  leads?: Lead[];
}
