// Auto-generated types for JournalVoucher
// Source: src/database/models/accounts/vouchers/acc_journal-voucher.model.ts

import type { JournalVoucherItem } from '../models/accounts/vouchers/acc_journal-voucher-item.model';
import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface JournalVoucherAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  voucherNo: string;
  date: Date;
  projectType?: string | null;
  titleOfWork?: string | null;
  project?: string | null;
  site?: string | null;
  task?: string | null;
  comment?: string | null;
  attachmentUrl?: string | null;
  totalDebit: number;
  totalCredit: number;
  addedBy?: string | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;

  // Relations
  items: JournalVoucherItem[];
  organization?: SysOrganization;
  projectRel?: Project;
}

export interface JournalVoucherCreationAttributes {
  voucherNo: string;
  date: Date;
  projectType?: string | null;
  titleOfWork?: string | null;
  project?: string | null;
  site?: string | null;
  task?: string | null;
  comment?: string | null;
  attachmentUrl?: string | null;
  totalDebit?: number; // Has default value
  totalCredit?: number; // Has default value
  addedBy?: string | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;
}

export type JournalVoucherUpdateAttributes = Partial<JournalVoucherCreationAttributes>;

// Helper type for including relations
export interface JournalVoucherWithRelations extends JournalVoucherAttributes {
  items: JournalVoucherItem[];
  organization?: SysOrganization;
  projectRel?: Project;
}
