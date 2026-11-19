// Auto-generated types for VoucherEntry
// Source: src/database/models/accounts/vouchers/acc_voucher-entry.model.ts

import type { Voucher } from '../models/accounts/vouchers/acc_voucher.model';
import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface VoucherEntryAttributes {
  id: number;
  voucherId: string;
  projectId: string | null;
  code: string | null;
  accountName: string | null;
  credit: number;
  debit: number;
  total: number;
  ref: string | null;
  chequeReceipt: string | null;
  comment: string | null;
  addedBy: string | null;
  attachmentCount: number;
  approveStatus: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;

  // Relations
  voucher: Voucher;
  organization?: SysOrganization;
  project?: Project;
}

export interface VoucherEntryCreationAttributes {
  id?: number; // Auto increment
  voucherId: string;
  projectId?: string | null; // Nullable
  code?: string | null; // Nullable
  accountName?: string | null; // Nullable
  credit?: number; // Has default value
  debit?: number; // Has default value
  total: number;
  ref?: string | null; // Nullable
  chequeReceipt?: string | null; // Nullable
  comment?: string | null; // Nullable
  addedBy?: string | null; // Nullable
  attachmentCount?: number; // Has default value
  approveStatus?: string; // Has default value
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
}

export type VoucherEntryUpdateAttributes = Partial<VoucherEntryCreationAttributes>;

// Helper type for including relations
export interface VoucherEntryWithRelations extends VoucherEntryAttributes {
  voucher: Voucher;
  organization?: SysOrganization;
  project?: Project;
}
