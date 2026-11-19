// Auto-generated types for BalanceSheet
// Source: src/database/models/accounts/reports/acc_balance-summury_list_model.ts

import { RowType } from '../models/accounts/reports/acc_balance-summury_list_model';

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface BalanceSheetAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  company: string;
  asOfDate: Date;
  particulars: string;
  balance: number;
  type: RowType;
  indent?: number | null;
  addedBy?: string | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;

  // Relations
  organization?: SysOrganization;
  project?: Project;
}

export interface BalanceSheetCreationAttributes {
  company: string;
  asOfDate: Date;
  particulars: string;
  balance?: number; // Has default value
  type?: RowType; // Has default value
  indent?: number | null;
  addedBy?: string | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;
}

export type BalanceSheetUpdateAttributes = Partial<BalanceSheetCreationAttributes>;

// Helper type for including relations
export interface BalanceSheetWithRelations extends BalanceSheetAttributes {
  organization?: SysOrganization;
  project?: Project;
}
