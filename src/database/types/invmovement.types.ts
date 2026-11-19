// Auto-generated types for InvMovement
// Source: src/database/models/inventory/inv-movement.model.ts

import type { InvWarehouse } from '../models/inventory/warehouse.model';
import type { InvItem } from '../models/inventory/inv_item.model';

export interface InvMovementAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  org_id: string;
  movement_no: string;
  movement_type: string;
  movement_date: Date;
  item_id: string;
  warehouse_id: number;
  to_warehouse_id?: number | null;
  quantity: number;
  unit_rate: number;
  total_amount: number;
  reference_type?: string | null;
  reference_id?: string | null;
  issued_to?: string | null;
  reason?: string | null;
  notes?: string | null;
  photo_url?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;

  // Relations
  warehouse?: InvWarehouse;
  item?: InvItem;
}

export interface InvMovementCreationAttributes {
  org_id: string;
  movement_no: string;
  movement_type: string;
  movement_date?: Date; // Has default value
  item_id: string;
  warehouse_id: number;
  to_warehouse_id?: number | null;
  quantity?: number; // Has default value
  unit_rate?: number; // Has default value
  total_amount?: number; // Has default value
  reference_type?: string | null;
  reference_id?: string | null;
  issued_to?: string | null;
  reason?: string | null;
  notes?: string | null;
  photo_url?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type InvMovementUpdateAttributes = Partial<InvMovementCreationAttributes>;

// Helper type for including relations
export interface InvMovementWithRelations extends InvMovementAttributes {
  warehouse?: InvWarehouse;
  item?: InvItem;
}
