// Auto-generated types for InvCategory
// Source: src/database/models/inventory/inv_category.model.ts

import type { InvSubCategory } from '../models/inventory/inv_sub_category.model';
import type { InvItem } from '../models/inventory/inv_item.model';

export interface InvCategoryAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  category_code: string;
  name: string;
  inventory_cog_id?: number | null;
  inventory_coa_id?: number | null;
  consumption_cog_id?: number | null;
  consumption_coa_id?: number | null;
  created_by?: number | null;
  updated_by?: number | null;
  deleted_by?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;

  // Relations
  sub_categories?: InvSubCategory[];
  items?: InvItem[];
}

export interface InvCategoryCreationAttributes {
  category_code: string;
  name: string;
  inventory_cog_id?: number | null;
  inventory_coa_id?: number | null;
  consumption_cog_id?: number | null;
  consumption_coa_id?: number | null;
  created_by?: number | null;
  updated_by?: number | null;
  deleted_by?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;
}

export type InvCategoryUpdateAttributes = Partial<InvCategoryCreationAttributes>;

// Helper type for including relations
export interface InvCategoryWithRelations extends InvCategoryAttributes {
  sub_categories?: InvSubCategory[];
  items?: InvItem[];
}
