// Auto-generated types for InvStockCount
// Source: src/database/models/inventory/stock-count.model.ts

export interface InvStockCountAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  warehouse_id?: number | null;
  counted_at: Date;
  status: string;
  note?: string | null;
  lines_json?: any | null;
  org_id: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export interface InvStockCountCreationAttributes {
  warehouse_id?: number | null;
  counted_at?: Date; // Has default value
  status?: string; // Has default value
  note?: string | null;
  lines_json?: any | null;
  org_id: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type InvStockCountUpdateAttributes = Partial<InvStockCountCreationAttributes>;

// Helper type for including relations
export interface InvStockCountWithRelations extends InvStockCountAttributes {
  // No relations defined
}
