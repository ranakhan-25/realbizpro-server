// Auto-generated types for LeadVisitStatus
// Source: src/database/models/crm/lead/crm-lead-master-data.model.ts

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { LeadActivity } from '../models/crm/lead/crm-lead-activity.model';

export interface LeadVisitStatusAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  orgId?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;
  name: string;
  color?: string | null;

  // Relations
  organization?: SysOrganization;
  activities?: LeadActivity[];
}

export interface LeadVisitStatusCreationAttributes {
  orgId?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;
  name: string;
  color?: string | null;
}

export type LeadVisitStatusUpdateAttributes = Partial<LeadVisitStatusCreationAttributes>;

// Helper type for including relations
export interface LeadVisitStatusWithRelations extends LeadVisitStatusAttributes {
  organization?: SysOrganization;
  activities?: LeadActivity[];
}
