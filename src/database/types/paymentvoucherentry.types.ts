// Auto-generated types for PaymentVoucherEntry
// Source: src/database/models/accounts/vouchers/acc_payment-voucher-entry.model.ts

import type { PaymentVoucher } from '../models/accounts/vouchers/acc_payment-voucher.model';
import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface PaymentVoucherEntryAttributes {
  id: number;
  paymentVoucherId: string;
  projectId: string | null;
  titleId: string | null;
  code: string | null;
  debitAccount: string | null;
  creditAccount: string | null;
  total: number;
  comment: string | null;
  cheque: string | null;
  addedBy: string | null;
  editedBy: string | null;
  approveStatus: string;
  attachmentCount: number;
  status: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;

  // Relations
  paymentVoucher: PaymentVoucher;
  organization?: SysOrganization;
  project?: Project;
}

export interface PaymentVoucherEntryCreationAttributes {
  id?: number; // Auto increment
  paymentVoucherId: string;
  projectId?: string | null; // Nullable
  titleId?: string | null; // Nullable
  code?: string | null; // Nullable
  debitAccount?: string | null; // Nullable
  creditAccount?: string | null; // Nullable
  total: number;
  comment?: string | null; // Nullable
  cheque?: string | null; // Nullable
  addedBy?: string | null; // Nullable
  editedBy?: string | null; // Nullable
  approveStatus?: string; // Has default value
  attachmentCount?: number; // Has default value
  status?: string; // Has default value
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
}

export type PaymentVoucherEntryUpdateAttributes = Partial<PaymentVoucherEntryCreationAttributes>;

// Helper type for including relations
export interface PaymentVoucherEntryWithRelations extends PaymentVoucherEntryAttributes {
  paymentVoucher: PaymentVoucher;
  organization?: SysOrganization;
  project?: Project;
}
