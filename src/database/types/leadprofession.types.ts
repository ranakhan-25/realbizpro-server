// Auto-generated types for LeadProfession
// Source: src/database/models/crm/lead/crm-lead-master-data.model.ts

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Lead } from '../models/crm/lead/crm-lead.model';

export interface LeadProfessionAttributes {
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
  status: string;
  description?: string | null;

  // Relations
  organization?: SysOrganization;
  leads?: Lead[];
}

export interface LeadProfessionCreationAttributes {
  orgId?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;
  name: string;
  status?: string; // Has default value
  description?: string | null;
}

export type LeadProfessionUpdateAttributes = Partial<LeadProfessionCreationAttributes>;

// Helper type for including relations
export interface LeadProfessionWithRelations extends LeadProfessionAttributes {
  organization?: SysOrganization;
  leads?: Lead[];
}
