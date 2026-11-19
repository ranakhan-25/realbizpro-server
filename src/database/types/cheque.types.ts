// Auto-generated types for Cheque
// Source: src/database/models/accounts/bank-reconciliation/acc_cheque.model.ts

import { ChequeStatus } from '../models/accounts/bank-reconciliation/acc_cheque.model';

import type { ChequeRange } from '../models/accounts/bank-reconciliation/acc_cheque-range.model';
import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface ChequeAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  chequeRangeUuid: string;
  instrumentNumber: string;
  chequeStatus: ChequeStatus;
  instrumentDate?: Date | null;
  favouringName?: string | null;
  amount?: number | null;
  addedBy?: string | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;

  // Relations
  chequeRange?: ChequeRange;
  organization?: SysOrganization;
  project?: Project;
}

export interface ChequeCreationAttributes {
  chequeRangeUuid: string;
  instrumentNumber: string;
  chequeStatus?: ChequeStatus; // Has default value
  instrumentDate?: Date | null;
  favouringName?: string | null;
  amount?: number | null;
  addedBy?: string | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;
}

export type ChequeUpdateAttributes = Partial<ChequeCreationAttributes>;

// Helper type for including relations
export interface ChequeWithRelations extends ChequeAttributes {
  chequeRange?: ChequeRange;
  organization?: SysOrganization;
  project?: Project;
}
