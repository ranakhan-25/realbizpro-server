// Auto-generated types for InvSubCategory
// Source: src\database\models\inventory\inv_sub_category.model.ts

import type { InvCategory } from '../models/inventory/inv_category.model';
import type { InvItem } from '../models/inventory/inv_item.model';

export interface InvSubCategoryAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  sub_category_code: string;
  name: string;
  category_id: any;
  created_by?: number | null;
  updated_by?: number | null;
  deleted_by?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;

  // Relations
  category?: InvCategory;
  items?: InvItem[];
}

export interface InvSubCategoryCreationAttributes {
  sub_category_code: string;
  name: string;
  category_id: any;
  created_by?: number | null;
  updated_by?: number | null;
  deleted_by?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;
}

export type InvSubCategoryUpdateAttributes = Partial<InvSubCategoryCreationAttributes>;

// Helper type for including relations
export interface InvSubCategoryWithRelations extends InvSubCategoryAttributes {
  category?: InvCategory;
  items?: InvItem[];
}
