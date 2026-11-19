// Auto-generated types for Expense
// Source: src/database/models/accounts/vouchers/acc_expence_list_model.ts

import type { ExpenseItem } from '../models/accounts/vouchers/acc_expense-item.model';
import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface ExpenseAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  projectType?: string | null;
  project?: string | null;
  titleOfWork?: string | null;
  task?: string | null;
  site?: string | null;
  date: Date;
  voucherNo: string;
  contact?: string | null;
  cashOrBank?: string | null;
  chequeNo?: string | null;
  comment?: string | null;
  attachmentUrl?: string | null;
  totalAmount: number;
  addedBy?: string | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;

  // Relations
  items: ExpenseItem[];
  organization?: SysOrganization;
  projectRel?: Project;
}

export interface ExpenseCreationAttributes {
  projectType?: string | null;
  project?: string | null;
  titleOfWork?: string | null;
  task?: string | null;
  site?: string | null;
  date: Date;
  voucherNo: string;
  contact?: string | null;
  cashOrBank?: string | null;
  chequeNo?: string | null;
  comment?: string | null;
  attachmentUrl?: string | null;
  totalAmount?: number; // Has default value
  addedBy?: string | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;
}

export type ExpenseUpdateAttributes = Partial<ExpenseCreationAttributes>;

// Helper type for including relations
export interface ExpenseWithRelations extends ExpenseAttributes {
  items: ExpenseItem[];
  organization?: SysOrganization;
  projectRel?: Project;
}
