// Auto-generated types for PaymentVoucher
// Source: src/database/models/accounts/vouchers/acc_payment-voucher.model.ts

import type { PaymentVoucherEntry } from '../models/accounts/vouchers/acc_payment-voucher-entry.model';
import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface PaymentVoucherAttributes {
  id: number;
  uuid: string;
  voucherNo: string;
  date: string;
  projectType: string | null;
  projectId: string | null;
  workId: string | null;
  taskId: string | null;
  siteId: string | null;
  accountId: string;
  paymentMethod: string;
  isCheque: boolean;
  chequeNo: string | null;
  comment: string | null;
  amount: number;
  invoiceId: string | null;
  itemId: string | null;
  attachmentUrl: string | null;
  status: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;

  // Relations
  entries: PaymentVoucherEntry[];
  organization?: SysOrganization;
  project?: Project;
}

export interface PaymentVoucherCreationAttributes {
  id?: number; // Auto increment
  uuid?: string;
  voucherNo: string;
  date: string;
  projectType?: string | null; // Nullable
  projectId?: string | null; // Nullable
  workId?: string | null; // Nullable
  taskId?: string | null; // Nullable
  siteId?: string | null; // Nullable
  accountId: string;
  paymentMethod: string;
  isCheque?: boolean; // Has default value
  chequeNo?: string | null; // Nullable
  comment?: string | null; // Nullable
  amount: number;
  invoiceId?: string | null; // Nullable
  itemId?: string | null; // Nullable
  attachmentUrl?: string | null; // Nullable
  status?: string; // Has default value
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
}

export type PaymentVoucherUpdateAttributes = Partial<PaymentVoucherCreationAttributes>;

// Helper type for including relations
export interface PaymentVoucherWithRelations extends PaymentVoucherAttributes {
  entries: PaymentVoucherEntry[];
  organization?: SysOrganization;
  project?: Project;
}
