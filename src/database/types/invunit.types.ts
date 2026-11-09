// Auto-generated types for InvUnit
// Source: src/database/models/inventory/inv_unit.model.ts

import type { InvItem } from '../models/inventory/inv_item.model';

export interface InvUnitAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  code: string;
  name: string;
  created_by?: number | null;
  updated_by?: number | null;
  deleted_by?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  org_id?: string | null;

  // Relations
  items: InvItem[];
}

export interface InvUnitCreationAttributes {
  code: string;
  name: string;
  created_by?: number | null;
  updated_by?: number | null;
  deleted_by?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  org_id?: string | null;
}

export type InvUnitUpdateAttributes = Partial<InvUnitCreationAttributes>;

// Helper type for including relations
export interface InvUnitWithRelations extends InvUnitAttributes {
  items: InvItem[];
}
