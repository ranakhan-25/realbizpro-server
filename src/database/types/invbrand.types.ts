// Auto-generated types for InvBrand
// Source: src/database/models/inventory/inv_brand.model.ts

import type { InvItem } from '../models/inventory/inv_item.model';

export interface InvBrandAttributes {
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

export interface InvBrandCreationAttributes {
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

export type InvBrandUpdateAttributes = Partial<InvBrandCreationAttributes>;

// Helper type for including relations
export interface InvBrandWithRelations extends InvBrandAttributes {
  items: InvItem[];
}
