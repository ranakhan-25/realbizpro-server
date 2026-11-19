// Auto-generated types for ChartOfGroup
// Source: src/database/models/accounts/configuration/acc_chats_of_group_model.ts

import type { ChartOfAccount } from '../models/accounts/configuration/acc_chats_of_accounts_model';
import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface ChartOfGroupAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  code: string;
  name: string;
  reportSection?: string | null;
  under: string;
  chartOfSection: string;
  hasDelete?: boolean | null;
  addedBy?: string | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;

  // Relations
  accounts: ChartOfAccount[];
  organization?: SysOrganization;
  project?: Project;
}

export interface ChartOfGroupCreationAttributes {
  code: string;
  name: string;
  reportSection?: string | null;
  under: string;
  chartOfSection: string;
  hasDelete?: boolean | null;
  addedBy?: string | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;
}

export type ChartOfGroupUpdateAttributes = Partial<ChartOfGroupCreationAttributes>;

// Helper type for including relations
export interface ChartOfGroupWithRelations extends ChartOfGroupAttributes {
  accounts: ChartOfAccount[];
  organization?: SysOrganization;
  project?: Project;
}
