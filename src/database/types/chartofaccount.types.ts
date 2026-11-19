// Auto-generated types for ChartOfAccount
// Source: src/database/models/accounts/configuration/acc_chats_of_accounts_model.ts

import type { ChartOfGroup } from '../models/accounts/configuration/acc_chats_of_group_model';
import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface ChartOfAccountAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  chartOfGroupUuid?: string | null;
  code: string;
  name: string;
  openingBalance: number;
  under: string;
  hasDelete?: boolean | null;
  addedBy?: string | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;

  // Relations
  chartOfGroup?: ChartOfGroup;
  organization?: SysOrganization;
  project?: Project;
}

export interface ChartOfAccountCreationAttributes {
  chartOfGroupUuid?: string | null;
  code: string;
  name: string;
  openingBalance?: number; // Has default value
  under: string;
  hasDelete?: boolean | null;
  addedBy?: string | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;
}

export type ChartOfAccountUpdateAttributes = Partial<ChartOfAccountCreationAttributes>;

// Helper type for including relations
export interface ChartOfAccountWithRelations extends ChartOfAccountAttributes {
  chartOfGroup?: ChartOfGroup;
  organization?: SysOrganization;
  project?: Project;
}
