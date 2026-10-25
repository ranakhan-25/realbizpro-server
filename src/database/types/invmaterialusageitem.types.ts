// Auto-generated types for InvMaterialUsageItem
// Source: src/database/models/inventory/inv_material_usage_item.model.ts

import type { InvMaterialUsage } from '../models/inventory/inv_material_usage.model';
import type { InvItem } from '../models/inventory/inv_item.model';

export interface InvMaterialUsageItemAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  usage_id: string;
  item_id: string;
  quantity: number;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;

  // Relations
  usage: InvMaterialUsage;
  item: InvItem;
}

export interface InvMaterialUsageItemCreationAttributes {
  usage_id: string;
  item_id: string;
  quantity: number;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;
}

export type InvMaterialUsageItemUpdateAttributes = Partial<InvMaterialUsageItemCreationAttributes>;

// Helper type for including relations
export interface InvMaterialUsageItemWithRelations extends InvMaterialUsageItemAttributes {
  usage: InvMaterialUsage;
  item: InvItem;
}
