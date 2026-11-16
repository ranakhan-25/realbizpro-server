// Auto-generated types for Quotation
// Source: src\database\models\projects\quatation\pr_quotation.model.ts

import type { BillingCategory } from '../models/projects/billing/pr_category.model';
import type { BillingSubCategory } from '../models/projects/billing/pr_sub_category.model';
import type { SysOrganization } from '../models/system/sys_organization.model';

export interface QuotationAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  uid?: string | null;
  date: Date;
  customer?: string | null;
  customerId?: string | null;
  code: string;
  projectType?: string | null;
  project?: string | null;
  projectId?: string | null;
  site?: string | null;
  categoryId?: string | null;
  subCategoryId?: string | null;
  items: Array<{
    itemName: string;
    unit: string;
    quantity: number;
    rate: number;
    details: string;
    image: string;
    amount: number;
  }>;
  attachment?: string | null;
  contentBody?: string | null;
  employeeName?: string | null;
  grandTotal: number;
  approveStatus?: string | null;
  addedBy?: string | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;

  // Relations
  category?: BillingCategory;
  subCategory?: BillingSubCategory;
  organization?: SysOrganization;
}

export interface QuotationCreationAttributes {
  uid?: string | null;
  date: Date;
  customer?: string | null;
  customerId?: string | null;
  code: string;
  projectType?: string | null;
  project?: string | null;
  projectId?: string | null;
  site?: string | null;
  categoryId?: string | null;
  subCategoryId?: string | null;
  items?: Array<{
    itemName: string;
    unit: string;
    quantity: number;
    rate: number;
    details: string;
    image: string;
    amount: number;
  }>; // Has default value
  attachment?: string | null;
  contentBody?: string | null;
  employeeName?: string | null;
  grandTotal?: number; // Has default value
  approveStatus?: string | null;
  addedBy?: string | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
}

export type QuotationUpdateAttributes = Partial<QuotationCreationAttributes>;

// Helper type for including relations
export interface QuotationWithRelations extends QuotationAttributes {
  category?: BillingCategory;
  subCategory?: BillingSubCategory;
  organization?: SysOrganization;
}
