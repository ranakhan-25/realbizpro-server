// Auto-generated types for ContraVoucherItem
// Source: src/database/models/accounts/vouchers/acc_contra-voucher-item.model.ts

import { EntryType } from '../models/accounts/vouchers/acc_contra-voucher-item.model';

import type { ContraVoucher } from '../models/accounts/vouchers/acc_contra-voucher.model';
import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface ContraVoucherItemAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  contraVoucherUuid: string;
  entryType: EntryType;
  accountId: string;
  accountName: string;
  debit: number;
  credit: number;
  chequeReceiptNo?: string | null;
  note?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;

  // Relations
  contraVoucher?: ContraVoucher;
  organization?: SysOrganization;
  project?: Project;
}

export interface ContraVoucherItemCreationAttributes {
  contraVoucherUuid: string;
  entryType: EntryType;
  accountId: string;
  accountName: string;
  debit?: number; // Has default value
  credit?: number; // Has default value
  chequeReceiptNo?: string | null;
  note?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;
}

export type ContraVoucherItemUpdateAttributes = Partial<ContraVoucherItemCreationAttributes>;

// Helper type for including relations
export interface ContraVoucherItemWithRelations extends ContraVoucherItemAttributes {
  contraVoucher?: ContraVoucher;
  organization?: SysOrganization;
  project?: Project;
}
