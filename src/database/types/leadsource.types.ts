// Auto-generated types for LeadSource
// Source: src/database/models/crm/lead/crm-lead-master-data.model.ts

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Lead } from '../models/crm/lead/crm-lead.model';
import type { LeadCampaign } from '../models/crm/lead/crm-lead-master-data.model';

export interface LeadSourceAttributes {
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
  code?: string | null;
  isActive?: boolean | null;

  // Relations
  organization?: SysOrganization;
  leads?: Lead[];
  campaigns?: LeadCampaign[];
}

export interface LeadSourceCreationAttributes {
  orgId?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;
  name: string;
  code?: string | null;
  isActive?: boolean | null;
}

export type LeadSourceUpdateAttributes = Partial<LeadSourceCreationAttributes>;

// Helper type for including relations
export interface LeadSourceWithRelations extends LeadSourceAttributes {
  organization?: SysOrganization;
  leads?: Lead[];
  campaigns?: LeadCampaign[];
}
