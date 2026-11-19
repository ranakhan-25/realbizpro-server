// Auto-generated types for CategoryAccountMapping
// Source: src/database/models/procurement/configuration/products/pr_category_account_mapping.model.ts

import { AccountCreationType } from '../models/procurement/configuration/products/pr_category_account_mapping.model';

import type { Category } from '../models/procurement/configuration/products/pr_category.model';
import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface CategoryAccountMappingAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  categoryId: string;
  inventoryAccountType: AccountCreationType;
  inventoryAccountGroupCode?: string | null;
  existingInventoryAccountId?: string | null;
  consumptionAccountType: AccountCreationType;
  consumptionAccountGroupCode?: string | null;
  existingConsumptionAccountId?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;
  deletedBy?: string | null;

  // Relations
  category?: Category;
  organization?: SysOrganization;
  project?: Project;
}

export interface CategoryAccountMappingCreationAttributes {
  categoryId: string;
  inventoryAccountType?: AccountCreationType; // Has default value
  inventoryAccountGroupCode?: string | null;
  existingInventoryAccountId?: string | null;
  consumptionAccountType?: AccountCreationType; // Has default value
  consumptionAccountGroupCode?: string | null;
  existingConsumptionAccountId?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;
  deletedBy?: string | null;
}

export type CategoryAccountMappingUpdateAttributes = Partial<CategoryAccountMappingCreationAttributes>;

// Helper type for including relations
export interface CategoryAccountMappingWithRelations extends CategoryAccountMappingAttributes {
  category?: Category;
  organization?: SysOrganization;
  project?: Project;
}
