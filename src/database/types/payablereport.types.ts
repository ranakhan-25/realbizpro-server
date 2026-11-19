// Auto-generated types for PayableReport
// Source: src/database/models/accounts/reports/acc_payeble_report_model.ts

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface PayableReportAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  supplierName: string;
  openingBalance: number;
  debit: number;
  credit: number;
  balance: number;
  project?: string | null;
  company?: string | null;
  contactType?: string | null;
  addedBy?: string | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;

  // Relations
  organization?: SysOrganization;
  projectRel?: Project;
}

export interface PayableReportCreationAttributes {
  supplierName: string;
  openingBalance?: number; // Has default value
  debit?: number; // Has default value
  credit?: number; // Has default value
  balance?: number; // Has default value
  project?: string | null;
  company?: string | null;
  contactType?: string | null;
  addedBy?: string | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;
}

export type PayableReportUpdateAttributes = Partial<PayableReportCreationAttributes>;

// Helper type for including relations
export interface PayableReportWithRelations extends PayableReportAttributes {
  organization?: SysOrganization;
  projectRel?: Project;
}
