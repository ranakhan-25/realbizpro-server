// Auto-generated types for InvWarehouse
// Source: src/database/models/inventory/warehouse.model.ts

export interface InvWarehouseAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  code: string;
  name: string;
  location?: string | null;
  type: string;
  is_active: boolean;
  org_id: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export interface InvWarehouseCreationAttributes {
  code: string;
  name: string;
  location?: string | null;
  type?: string; // Has default value
  is_active?: boolean; // Has default value
  org_id: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type InvWarehouseUpdateAttributes = Partial<InvWarehouseCreationAttributes>;

// Helper type for including relations
export interface InvWarehouseWithRelations extends InvWarehouseAttributes {
  // No relations defined
}
