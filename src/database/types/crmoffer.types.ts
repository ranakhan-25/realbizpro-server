// Auto-generated types for CrmOffer
// Source: src/database/models/crm/configuration/crm-offer.model.ts

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Lead } from '../models/crm/lead/crm-lead.model';

export interface CrmOfferAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  name: string;
  status: string;
  description?: string | null;
  orgId?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;

  // Relations
  organization?: SysOrganization;
  leads?: Lead[];
}

export interface CrmOfferCreationAttributes {
  name: string;
  status?: string; // Has default value
  description?: string | null;
  orgId?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;
}

export type CrmOfferUpdateAttributes = Partial<CrmOfferCreationAttributes>;

// Helper type for including relations
export interface CrmOfferWithRelations extends CrmOfferAttributes {
  organization?: SysOrganization;
  leads?: Lead[];
}
