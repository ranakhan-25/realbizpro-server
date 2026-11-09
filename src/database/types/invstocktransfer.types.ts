// Auto-generated types for InvStockTransfer
// Source: src\database\models\inventory\inv_stock_transfer.model.ts

import type { InvItem } from '../models/inventory/inv_item.model';

export interface InvStockTransferAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  date: Date;
  note?: string | null;
  status: string;
  from_project_id?: number | null;
  to_project_id?: number | null;
  from_site_id?: number | null;
  to_site_id?: number | null;
  item_id: string;
  quantity: number;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  org_id?: string | null;

  // Relations
  item: InvItem;
}

export interface InvStockTransferCreationAttributes {
  date: Date;
  note?: string | null;
  status?: string; // Has default value
  from_project_id?: number | null;
  to_project_id?: number | null;
  from_site_id?: number | null;
  to_site_id?: number | null;
  item_id: string;
  quantity: number;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  org_id?: string | null;
}

export type InvStockTransferUpdateAttributes = Partial<InvStockTransferCreationAttributes>;

// Helper type for including relations
export interface InvStockTransferWithRelations extends InvStockTransferAttributes {
  item: InvItem;
}
