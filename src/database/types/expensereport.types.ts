// Auto-generated types for ExpenseReport
// Source: src/database/models/accounts/reports/acc_expense-report.model.ts

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface ExpenseReportAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  date: Date;
  voucher: string;
  description: string;
  note?: string | null;
  amount: number;
  company?: string | null;
  project?: string | null;
  site?: string | null;
  task?: string | null;
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

export interface ExpenseReportCreationAttributes {
  date: Date;
  voucher: string;
  description: string;
  note?: string | null;
  amount?: number; // Has default value
  company?: string | null;
  project?: string | null;
  site?: string | null;
  task?: string | null;
  addedBy?: string | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;
}

export type ExpenseReportUpdateAttributes = Partial<ExpenseReportCreationAttributes>;

// Helper type for including relations
export interface ExpenseReportWithRelations extends ExpenseReportAttributes {
  organization?: SysOrganization;
  projectRel?: Project;
}
