// Auto-generated types for ExpenseItem
// Source: src/database/models/accounts/vouchers/acc_expense-item.model.ts

import type { Expense } from '../models/accounts/vouchers/acc_expence_list_model';
import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface ExpenseItemAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  expenseUuid: string;
  accountId: string;
  amount: number;
  note?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;

  // Relations
  expense?: Expense;
  organization?: SysOrganization;
  project?: Project;
}

export interface ExpenseItemCreationAttributes {
  expenseUuid: string;
  accountId: string;
  amount?: number; // Has default value
  note?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;
}

export type ExpenseItemUpdateAttributes = Partial<ExpenseItemCreationAttributes>;

// Helper type for including relations
export interface ExpenseItemWithRelations extends ExpenseItemAttributes {
  expense?: Expense;
  organization?: SysOrganization;
  project?: Project;
}
