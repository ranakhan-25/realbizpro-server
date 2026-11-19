// Auto-generated types for WorkOrder
// Source: src/database/models/projects/billing/work-order/pr_work_order.model.ts

import type { CustomerAccount } from '../models/projects/contract/pr_customer_accounts.model';
import type { ProjectType } from '../models/projects/project-type/pr_project_type.model';
import type { Project } from '../models/projects/project/pr_project.model';
import type { Site } from '../models/projects/project-site/pr_project_site.model';
import type { BillingCategory } from '../models/projects/billing/pr_category.model';
import type { BillingSubCategory } from '../models/projects/billing/pr_sub_category.model';
import type { SysOrganization } from '../models/system/sys_organization.model';

export interface WorkOrderAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  code: string;
  date: string;
  customerId?: string | null;
  clientOrderNo?: string | null;
  projectTypeId?: string | null;
  projectId: string;
  siteId?: string | null;
  poNo?: string | null;
  attachment?: string | null;
  categoryId?: string | null;
  subCategoryId?: string | null;
  items: Array<Record<string, unknown>>;
  subtotal: number;
  vatPercent: number;
  vatInclude: boolean;
  vatAmount: number;
  aitPercent: number;
  aitInclude: boolean;
  aitAmount: number;
  grandTotal: number;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;

  // Relations
  customer?: CustomerAccount;
  projectType?: ProjectType;
  project?: Project;
  site?: Site;
  category?: BillingCategory;
  subCategory?: BillingSubCategory;
  organization?: SysOrganization;
}

export interface WorkOrderCreationAttributes {
  code: string;
  date: string;
  customerId?: string | null;
  clientOrderNo?: string | null;
  projectTypeId?: string | null;
  projectId: string;
  siteId?: string | null;
  poNo?: string | null;
  attachment?: string | null;
  categoryId?: string | null;
  subCategoryId?: string | null;
  items?: Array<Record<string, unknown>>; // Has default value
  subtotal?: number; // Has default value
  vatPercent?: number; // Has default value
  vatInclude?: boolean; // Has default value
  vatAmount?: number; // Has default value
  aitPercent?: number; // Has default value
  aitInclude?: boolean; // Has default value
  aitAmount?: number; // Has default value
  grandTotal?: number; // Has default value
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
}

export type WorkOrderUpdateAttributes = Partial<WorkOrderCreationAttributes>;

// Helper type for including relations
export interface WorkOrderWithRelations extends WorkOrderAttributes {
  customer?: CustomerAccount;
  projectType?: ProjectType;
  project?: Project;
  site?: Site;
  category?: BillingCategory;
  subCategory?: BillingSubCategory;
  organization?: SysOrganization;
}
