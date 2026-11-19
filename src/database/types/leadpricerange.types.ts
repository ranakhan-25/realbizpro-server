// Auto-generated types for LeadPriceRange
// Source: src/database/models/crm/lead/crm-lead-master-data.model.ts

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Lead } from '../models/crm/lead/crm-lead.model';

export interface LeadPriceRangeAttributes {
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
  minPrice?: number | null;
  maxPrice?: number | null;

  // Relations
  organization?: SysOrganization;
  leads?: Lead[];
}

export interface LeadPriceRangeCreationAttributes {
  orgId?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;
  name: string;
  minPrice?: number | null;
  maxPrice?: number | null;
}

export type LeadPriceRangeUpdateAttributes = Partial<LeadPriceRangeCreationAttributes>;

// Helper type for including relations
export interface LeadPriceRangeWithRelations extends LeadPriceRangeAttributes {
  organization?: SysOrganization;
  leads?: Lead[];
}
