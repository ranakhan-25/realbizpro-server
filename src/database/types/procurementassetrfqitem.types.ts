// Auto-generated types for ProcurementAssetRfqItem
// Source: src/database/models/procurement/rfq/pr_asset_rfq_item.model.ts

import type { ProcurementAssetRfq } from '../models/procurement/rfq/pr_asset_rfq.model';
import type { ProcurementAssetItemEntry } from '../models/procurement/configuration/asset/pr_asset_item_entry.model';
import type { ProcurementUnit } from '../models/procurement/configuration/products/pr_unit.model';
import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface ProcurementAssetRfqItemAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  rfq_id: string;
  item_id: string;
  unit_id: string;
  item_code: string;
  item_name: string;
  details?: string | null;
  unit: string;
  quantity: number;
  rate: number;
  required_qty: number;
  purchase_qty: number;
  stock_qty: number;
  amount: number;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;

  // Relations
  rfq?: ProcurementAssetRfq;
  item?: ProcurementAssetItemEntry;
  unitRelation?: ProcurementUnit;
  organization?: SysOrganization;
  project?: Project;
}

export interface ProcurementAssetRfqItemCreationAttributes {
  rfq_id: string;
  item_id: string;
  unit_id: string;
  item_code: string;
  item_name: string;
  details?: string | null;
  unit: string;
  quantity?: number; // Has default value
  rate?: number; // Has default value
  required_qty?: number; // Has default value
  purchase_qty?: number; // Has default value
  stock_qty?: number; // Has default value
  amount?: number; // Has default value
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;
}

export type ProcurementAssetRfqItemUpdateAttributes = Partial<ProcurementAssetRfqItemCreationAttributes>;

// Helper type for including relations
export interface ProcurementAssetRfqItemWithRelations extends ProcurementAssetRfqItemAttributes {
  rfq?: ProcurementAssetRfq;
  item?: ProcurementAssetItemEntry;
  unitRelation?: ProcurementUnit;
  organization?: SysOrganization;
  project?: Project;
}
