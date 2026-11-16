// Auto-generated types for BillingSubCategory
// Source: src/database/models/projects/billing/pr_sub_category.model.ts

import { SubCategoryType } from '../models/projects/billing/pr_sub_category.model';

import type { BillingCategory } from '../models/projects/billing/pr_category.model';
import type { Quotation } from '../models/projects/quatation/pr_quotation.model';
import type { WorkOrder } from '../models/projects/billing/work-order/pr_work_order.model';
import type { SysOrganization } from '../models/system/sys_organization.model';

export interface BillingSubCategoryAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  type: SubCategoryType;
  categoryId?: string | null;
  code: string;
  name: string;
  description?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;

  // Relations
  category?: BillingCategory;
  quotations?: Quotation[];
  workOrders?: WorkOrder[];
  organization?: SysOrganization;
}

export interface BillingSubCategoryCreationAttributes {
  type: SubCategoryType;
  categoryId?: string | null;
  code: string;
  name: string;
  description?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
}

export type BillingSubCategoryUpdateAttributes = Partial<BillingSubCategoryCreationAttributes>;

// Helper type for including relations
export interface BillingSubCategoryWithRelations extends BillingSubCategoryAttributes {
  category?: BillingCategory;
  quotations?: Quotation[];
  workOrders?: WorkOrder[];
  organization?: SysOrganization;
}
