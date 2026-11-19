// Auto-generated types for Asset
// Source: src/database/models/accounts/assets/assets_list_model.ts

import { DepreciationMethod } from '../models/accounts/assets/assets_list_model';
import { ComputationType } from '../models/accounts/assets/assets_list_model';
import { AssetStatus } from '../models/accounts/assets/assets_list_model';

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface AssetAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  itemName: string;
  location: string | null;
  acquisitionDate: Date;
  originalValue: number;
  notDepreciableValue: number;
  bookValue: number;
  depreciableValue: number;
  method: DepreciationMethod;
  duration: number;
  computation: ComputationType;
  project?: string | null;
  expenseAccount?: string | null;
  voucherNo?: string | null;
  status: AssetStatus;
  addedBy?: string | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;

  // Relations
  organization?: SysOrganization;
  projectRel?: Project;
}

export interface AssetCreationAttributes {
  itemName: string;
  location?: string | null; // Has default value
  acquisitionDate: Date;
  originalValue?: number; // Has default value
  notDepreciableValue?: number; // Has default value
  bookValue?: number; // Has default value
  depreciableValue?: number; // Has default value
  method?: DepreciationMethod; // Has default value
  duration?: number; // Has default value
  computation?: ComputationType; // Has default value
  project?: string | null;
  expenseAccount?: string | null;
  voucherNo?: string | null;
  status?: AssetStatus; // Has default value
  addedBy?: string | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;
}

export type AssetUpdateAttributes = Partial<AssetCreationAttributes>;

// Helper type for including relations
export interface AssetWithRelations extends AssetAttributes {
  organization?: SysOrganization;
  projectRel?: Project;
}
