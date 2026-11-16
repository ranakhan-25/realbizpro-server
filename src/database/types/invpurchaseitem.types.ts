// Auto-generated types for InvPurchaseItem
// Source: src\database\models\inventory\inv_purchase_item.model.ts

import type { InvPurchase } from '../models/inventory/inv_purchase.model';
import type { InvItem } from '../models/inventory/inv_item.model';

export interface InvPurchaseItemAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  purchase_id: string;
  item_id: string;
  quantity: number;
  rate: number;
  amount: number;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  org_id: string;

  // Relations
  purchase?: InvPurchase;
  item?: InvItem;
}

export interface InvPurchaseItemCreationAttributes {
  purchase_id: string;
  item_id: string;
  quantity: number;
  rate: number;
  amount: number;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  org_id: string;
}

export type InvPurchaseItemUpdateAttributes = Partial<InvPurchaseItemCreationAttributes>;

// Helper type for including relations
export interface InvPurchaseItemWithRelations extends InvPurchaseItemAttributes {
  purchase?: InvPurchase;
  item?: InvItem;
}
