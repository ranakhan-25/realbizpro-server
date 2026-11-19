// Auto-generated types for LeadVisitPlace
// Source: src/database/models/crm/lead/crm-lead-master-data.model.ts

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { LeadActivity } from '../models/crm/lead/crm-lead-activity.model';

export interface LeadVisitPlaceAttributes {
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
  address?: string | null;
  contactPerson?: string | null;
  contactNumber?: string | null;

  // Relations
  organization?: SysOrganization;
  activities?: LeadActivity[];
}

export interface LeadVisitPlaceCreationAttributes {
  orgId?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;
  name: string;
  address?: string | null;
  contactPerson?: string | null;
  contactNumber?: string | null;
}

export type LeadVisitPlaceUpdateAttributes = Partial<LeadVisitPlaceCreationAttributes>;

// Helper type for including relations
export interface LeadVisitPlaceWithRelations extends LeadVisitPlaceAttributes {
  organization?: SysOrganization;
  activities?: LeadActivity[];
}
