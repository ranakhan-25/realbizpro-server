// Auto-generated types for InvStockBalance
// Source: src/database/models/inventory/stock-balance.model.ts

import type { InvWarehouse } from '../models/inventory/warehouse.model';
import type { InvItem } from '../models/inventory/inv_item.model';

export interface InvStockBalanceAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  org_id: string;
  warehouse_id: number;
  item_id: string;
  current_qty: number;
  reserved_qty: number;
  available_qty: number;
  avg_cost: number;
  last_movement_at?: Date | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;

  // Relations
  warehouse?: InvWarehouse;
  item?: InvItem;
}

export interface InvStockBalanceCreationAttributes {
  org_id: string;
  warehouse_id: number;
  item_id: string;
  current_qty?: number; // Has default value
  reserved_qty?: number; // Has default value
  available_qty?: number; // Has default value
  avg_cost?: number; // Has default value
  last_movement_at?: Date | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type InvStockBalanceUpdateAttributes = Partial<InvStockBalanceCreationAttributes>;

// Helper type for including relations
export interface InvStockBalanceWithRelations extends InvStockBalanceAttributes {
  warehouse?: InvWarehouse;
  item?: InvItem;
}
