// Auto-generated types for Item
// Source: src/database/models/projects/billing/pr_item.model.ts

import type { BillingCategory } from '../models/projects/billing/pr_category.model';
import type { BillingSubCategory } from '../models/projects/billing/pr_sub_category.model';
import type { InvoiceItem } from '../models/projects/billing/pr_invoice_item.model';
import type { SysOrganization } from '../models/system/sys_organization.model';

export interface ItemAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  itemName: string;
  categoryId?: string | null;
  subCategoryId?: string | null;
  brand?: string | null;
  unit: string;
  purchasePrice: number;
  salePrice: number;
  image?: string | null;
  isActive: boolean;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;

  // Relations
  category?: BillingCategory;
  subCategory?: BillingSubCategory;
  invoiceItems?: InvoiceItem[];
  organization?: SysOrganization;
}

export interface ItemCreationAttributes {
  itemName: string;
  categoryId?: string | null;
  subCategoryId?: string | null;
  brand?: string | null;
  unit?: string; // Has default value
  purchasePrice?: number; // Has default value
  salePrice?: number; // Has default value
  image?: string | null;
  isActive?: boolean; // Has default value
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
}

export type ItemUpdateAttributes = Partial<ItemCreationAttributes>;

// Helper type for including relations
export interface ItemWithRelations extends ItemAttributes {
  category?: BillingCategory;
  subCategory?: BillingSubCategory;
  invoiceItems?: InvoiceItem[];
  organization?: SysOrganization;
}
