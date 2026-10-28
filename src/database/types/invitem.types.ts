// Auto-generated types for InvItem
// Source: src\database\models\inventory\inv_item.model.ts

import type { InvCategory } from '../models/inventory/inv_category.model';
import type { InvSubCategory } from '../models/inventory/inv_sub_category.model';
import type { InvBrand } from '../models/inventory/inv_brand.model';
import type { InvUnit } from '../models/inventory/inv_unit.model';

export interface InvItemAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  item_code: string;
  name: string;
  type?: string | null;
  purchase_price: number;
  sale_price: number;
  category_id: any;
  sub_category_id?: any | null;
  brand_id?: any | null;
  unit_id: any;
  created_by?: number | null;
  updated_by?: number | null;
  deleted_by?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;

  // Relations
  category: InvCategory;
  sub_category: InvSubCategory;
  brand: InvBrand;
  unit: InvUnit;
}

export interface InvItemCreationAttributes {
  item_code: string;
  name: string;
  type?: string | null;
  purchase_price?: number; // Has default value
  sale_price?: number; // Has default value
  category_id: any;
  sub_category_id?: any | null;
  brand_id?: any | null;
  unit_id: any;
  created_by?: number | null;
  updated_by?: number | null;
  deleted_by?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;
}

export type InvItemUpdateAttributes = Partial<InvItemCreationAttributes>;

// Helper type for including relations
export interface InvItemWithRelations extends InvItemAttributes {
  category: InvCategory;
  sub_category: InvSubCategory;
  brand: InvBrand;
  unit: InvUnit;
}
