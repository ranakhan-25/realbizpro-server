// Auto-generated types for BankReconciliation
// Source: src/database/models/accounts/bank-reconciliation/acc_bank-reconciliation.model.ts

import { ReconciliationStatus } from '../models/accounts/bank-reconciliation/acc_bank-reconciliation.model';

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface BankReconciliationAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  voucherNo: string;
  description: string;
  bank: string;
  date: Date;
  chequeDate?: Date | null;
  amount: number;
  note?: string | null;
  status: ReconciliationStatus;
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

export interface BankReconciliationCreationAttributes {
  voucherNo: string;
  description: string;
  bank: string;
  date: Date;
  chequeDate?: Date | null;
  amount?: number; // Has default value
  note?: string | null;
  status?: ReconciliationStatus; // Has default value
  addedBy?: string | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;
}

export type BankReconciliationUpdateAttributes = Partial<BankReconciliationCreationAttributes>;

// Helper type for including relations
export interface BankReconciliationWithRelations extends BankReconciliationAttributes {
  organization?: SysOrganization;
  project?: Project;
}
