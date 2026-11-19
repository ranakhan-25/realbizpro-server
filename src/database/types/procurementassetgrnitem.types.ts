// Auto-generated types for ProcurementAssetGrnItem
// Source: src/database/models/procurement/grn/pr_asset_grn_item.model.ts

import type { ProcurementAssetGrn } from '../models/procurement/grn/pr_asset_grn.model';
import type { ProcurementAssetItemEntry } from '../models/procurement/configuration/asset/pr_asset_item_entry.model';
import type { ProcurementUnit } from '../models/procurement/configuration/products/pr_unit.model';
import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface ProcurementAssetGrnItemAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  grn_id: string;
  item_id?: string | null;
  unit_id?: string | null;
  item_code: string;
  item_name: string;
  details?: string | null;
  unit?: string | null;
  quantity: number;
  rate: number;
  amount: number;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;

  // Relations
  grn?: ProcurementAssetGrn;
  item?: ProcurementAssetItemEntry;
  unitRelation?: ProcurementUnit;
  organization?: SysOrganization;
  project?: Project;
}

export interface ProcurementAssetGrnItemCreationAttributes {
  grn_id: string;
  item_id?: string | null;
  unit_id?: string | null;
  item_code: string;
  item_name: string;
  details?: string | null;
  unit?: string | null;
  quantity?: number; // Has default value
  rate?: number; // Has default value
  amount?: number; // Has default value
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;
}

export type ProcurementAssetGrnItemUpdateAttributes = Partial<ProcurementAssetGrnItemCreationAttributes>;

// Helper type for including relations
export interface ProcurementAssetGrnItemWithRelations extends ProcurementAssetGrnItemAttributes {
  grn?: ProcurementAssetGrn;
  item?: ProcurementAssetItemEntry;
  unitRelation?: ProcurementUnit;
  organization?: SysOrganization;
  project?: Project;
}
