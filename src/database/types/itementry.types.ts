// Auto-generated types for ItemEntry
// Source: src/database/models/accounts/assets/acc_item_entry_model.ts

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface ItemEntryAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  itemName: string;
  location: string | null;
  acquisitionDate: Date;
  originalValue: number;
  method: string | null;
  bookValue: number;
  depreciableValue: number;
  status: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;

  // Relations
  organization?: SysOrganization;
  project?: Project;
}

export interface ItemEntryCreationAttributes {
  itemName: string;
  location?: string | null; // Has default value
  acquisitionDate: Date;
  originalValue?: number; // Has default value
  method?: string | null; // Nullable
  bookValue?: number; // Has default value
  depreciableValue?: number; // Has default value
  status?: string; // Has default value
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;
}

export type ItemEntryUpdateAttributes = Partial<ItemEntryCreationAttributes>;

// Helper type for including relations
export interface ItemEntryWithRelations extends ItemEntryAttributes {
  organization?: SysOrganization;
  project?: Project;
}
