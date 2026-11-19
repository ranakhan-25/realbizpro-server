// Auto-generated types for ProcurementMaterialIssue
// Source: src/database/models/procurement/material-issue/pr_material_issue.model.ts

import { ProcurementMaterialIssueStatus } from '../models/procurement/material-issue/pr_material_issue.model';

import type { ProcurementGrn } from '../models/procurement/grn/pr_grn.model';
import type { SysUser } from '../models/system/sys_user.model';
import type { ProcurementMaterialIssueItem } from '../models/procurement/material-issue/pr_material_issue_item.model';
import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface ProcurementMaterialIssueAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  issue_no: string;
  grn_id: string;
  date: string;
  purpose: string;
  issued_by_id?: number | null;
  added_by_id?: number | null;
  total_amount: number;
  status: ProcurementMaterialIssueStatus;
  notes?: string | null;
  orgId?: number | null;
  projectId?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;

  // Relations
  grn?: ProcurementGrn;
  issuedBy?: SysUser;
  addedBy?: SysUser;
  items?: ProcurementMaterialIssueItem[];
  organization?: SysOrganization;
  project?: Project;
}

export interface ProcurementMaterialIssueCreationAttributes {
  issue_no: string;
  grn_id: string;
  date: string;
  purpose: string;
  issued_by_id?: number | null;
  added_by_id?: number | null;
  total_amount?: number; // Has default value
  status?: ProcurementMaterialIssueStatus; // Has default value
  notes?: string | null;
  orgId?: number | null;
  projectId?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type ProcurementMaterialIssueUpdateAttributes = Partial<ProcurementMaterialIssueCreationAttributes>;

// Helper type for including relations
export interface ProcurementMaterialIssueWithRelations extends ProcurementMaterialIssueAttributes {
  grn?: ProcurementGrn;
  issuedBy?: SysUser;
  addedBy?: SysUser;
  items?: ProcurementMaterialIssueItem[];
  organization?: SysOrganization;
  project?: Project;
}
