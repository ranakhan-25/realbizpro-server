// Auto-generated types for LeadCategory
// Source: src/database/models/crm/lead/crm-lead-master-data.model.ts

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Lead } from '../models/crm/lead/crm-lead.model';

export interface LeadCategoryAttributes {
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
  description?: string | null;
  isActive?: boolean | null;

  // Relations
  organization?: SysOrganization;
  leads?: Lead[];
}

export interface LeadCategoryCreationAttributes {
  orgId?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;
  name: string;
  code?: string | null;
  description?: string | null;
  isActive?: boolean | null;
}

export type LeadCategoryUpdateAttributes = Partial<LeadCategoryCreationAttributes>;

// Helper type for including relations
export interface LeadCategoryWithRelations extends LeadCategoryAttributes {
  organization?: SysOrganization;
  leads?: Lead[];
}
