// Auto-generated types for JournalVoucherItem
// Source: src/database/models/accounts/vouchers/acc_journal-voucher-item.model.ts

import { EntryType } from '../models/accounts/vouchers/acc_journal-voucher-item.model';

import type { JournalVoucher } from '../models/accounts/vouchers/acc_journal-voucher.model';
import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface JournalVoucherItemAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  journalVoucherUuid: string;
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
  journalVoucher?: JournalVoucher;
  organization?: SysOrganization;
  project?: Project;
}

export interface JournalVoucherItemCreationAttributes {
  journalVoucherUuid: string;
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

export type JournalVoucherItemUpdateAttributes = Partial<JournalVoucherItemCreationAttributes>;

// Helper type for including relations
export interface JournalVoucherItemWithRelations extends JournalVoucherItemAttributes {
  journalVoucher?: JournalVoucher;
  organization?: SysOrganization;
  project?: Project;
}
