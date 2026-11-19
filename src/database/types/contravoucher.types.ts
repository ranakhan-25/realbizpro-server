// Auto-generated types for ContraVoucher
// Source: src/database/models/accounts/vouchers/acc_contra-voucher.model.ts

import type { ContraVoucherItem } from '../models/accounts/vouchers/acc_contra-voucher-item.model';
import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface ContraVoucherAttributes {
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
  items: ContraVoucherItem[];
  organization?: SysOrganization;
  projectRel?: Project;
}

export interface ContraVoucherCreationAttributes {
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

export type ContraVoucherUpdateAttributes = Partial<ContraVoucherCreationAttributes>;

// Helper type for including relations
export interface ContraVoucherWithRelations extends ContraVoucherAttributes {
  items: ContraVoucherItem[];
  organization?: SysOrganization;
  projectRel?: Project;
}
