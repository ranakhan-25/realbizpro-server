// Auto-generated types for Voucher
// Source: src/database/models/accounts/vouchers/acc_voucher.model.ts

import type { VoucherEntry } from '../models/accounts/vouchers/acc_voucher-entry.model';
import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface VoucherAttributes {
  id: number;
  uuid: string;
  voucherNo: string;
  voucherType: string;
  date: string;
  projectType: string | null;
  projectId: string | null;
  workId: string | null;
  accountId: string;
  paymentMethod: string;
  chequeNo: string | null;
  amount: number;
  comment: string | null;
  attachmentUrl: string | null;
  status: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;

  // Relations
  entries: VoucherEntry[];
  organization?: SysOrganization;
  project?: Project;
}

export interface VoucherCreationAttributes {
  id?: number; // Auto increment
  uuid?: string;
  voucherNo: string;
  voucherType: string;
  date: string;
  projectType?: string | null; // Nullable
  projectId?: string | null; // Nullable
  workId?: string | null; // Nullable
  accountId: string;
  paymentMethod: string;
  chequeNo?: string | null; // Nullable
  amount: number;
  comment?: string | null; // Nullable
  attachmentUrl?: string | null; // Nullable
  status?: string; // Has default value
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
}

export type VoucherUpdateAttributes = Partial<VoucherCreationAttributes>;

// Helper type for including relations
export interface VoucherWithRelations extends VoucherAttributes {
  entries: VoucherEntry[];
  organization?: SysOrganization;
  project?: Project;
}
