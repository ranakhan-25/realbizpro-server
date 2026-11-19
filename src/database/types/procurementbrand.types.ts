// Auto-generated types for ProcurementBrand
// Source: src/database/models/procurement/configuration/products/pr_brand.model.ts

import type { ProcurementItemEntry } from '../models/procurement/configuration/products/pr_item_entry.model';
import type { ProcurementAssetItemEntry } from '../models/procurement/configuration/asset/pr_asset_item_entry.model';
import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface ProcurementBrandAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  code: string;
  name: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;

  // Relations
  itemEntries?: ProcurementItemEntry[];
  assetItems?: ProcurementAssetItemEntry[];
  organization?: SysOrganization;
  project?: Project;
}

export interface ProcurementBrandCreationAttributes {
  code: string;
  name: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;
}

export type ProcurementBrandUpdateAttributes = Partial<ProcurementBrandCreationAttributes>;

// Helper type for including relations
export interface ProcurementBrandWithRelations extends ProcurementBrandAttributes {
  itemEntries?: ProcurementItemEntry[];
  assetItems?: ProcurementAssetItemEntry[];
  organization?: SysOrganization;
  project?: Project;
}
