// Auto-generated types for ProcurementSubCategory
// Source: src/database/models/procurement/configuration/products/pr_sub_category.model.ts

import type { Category } from '../models/procurement/configuration/products/pr_category.model';
import type { ProcurementItemEntry } from '../models/procurement/configuration/products/pr_item_entry.model';
import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface ProcurementSubCategoryAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  categoryId: string;
  code: string;
  name: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;

  // Relations
  category?: Category;
  itemEntries?: ProcurementItemEntry[];
  organization?: SysOrganization;
  project?: Project;
}

export interface ProcurementSubCategoryCreationAttributes {
  categoryId: string;
  code: string;
  name: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;
}

export type ProcurementSubCategoryUpdateAttributes = Partial<ProcurementSubCategoryCreationAttributes>;

// Helper type for including relations
export interface ProcurementSubCategoryWithRelations extends ProcurementSubCategoryAttributes {
  category?: Category;
  itemEntries?: ProcurementItemEntry[];
  organization?: SysOrganization;
  project?: Project;
}
