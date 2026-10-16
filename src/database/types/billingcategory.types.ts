// Auto-generated types for BillingCategory
// Source: src/database/models/projects/billing/pr_category.model.ts

import { CategoryType } from '../models/projects/billing/pr_category.model';

import type { MaterialRequisition } from '../models/projects/material-requisition/pr_material_requisition.model';
import type { BillingSubCategory } from '../models/projects/billing/pr_sub_category.model';
import type { Quotation } from '../models/projects/quatation/pr_quotation.model';

export interface BillingCategoryAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  type: CategoryType;
  code: string;
  name: string;
  description?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;

  // Relations
  materialRequisitions?: MaterialRequisition[];
  subCategories?: BillingSubCategory[];
  quotations?: Quotation[];
}

export interface BillingCategoryCreationAttributes {
  type: CategoryType;
  code: string;
  name: string;
  description?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type BillingCategoryUpdateAttributes = Partial<BillingCategoryCreationAttributes>;

// Helper type for including relations
export interface BillingCategoryWithRelations extends BillingCategoryAttributes {
  materialRequisitions?: MaterialRequisition[];
  subCategories?: BillingSubCategory[];
  quotations?: Quotation[];
}
