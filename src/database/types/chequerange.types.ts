// Auto-generated types for ChequeRange
// Source: src/database/models/accounts/bank-reconciliation/acc_cheque-range.model.ts

import type { Cheque } from '../models/accounts/bank-reconciliation/acc_cheque.model';
import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface ChequeRangeAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  cashBank: string;
  name: string;
  fromNumber: number;
  toNumber: number;
  numberOfCheque: number;
  addedBy?: string | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;

  // Relations
  cheques: Cheque[];
  organization?: SysOrganization;
  project?: Project;
}

export interface ChequeRangeCreationAttributes {
  cashBank: string;
  name: string;
  fromNumber: number;
  toNumber: number;
  numberOfCheque: number;
  addedBy?: string | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;
}

export type ChequeRangeUpdateAttributes = Partial<ChequeRangeCreationAttributes>;

// Helper type for including relations
export interface ChequeRangeWithRelations extends ChequeRangeAttributes {
  cheques: Cheque[];
  organization?: SysOrganization;
  project?: Project;
}
