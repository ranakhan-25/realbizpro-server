// Auto-generated types for ProcurementMaterialIssueItem
// Source: src/database/models/procurement/material-issue/pr_material_issue_item.model.ts

import type { ProcurementMaterialIssue } from '../models/procurement/material-issue/pr_material_issue.model';
import type { ProcurementGrnItem } from '../models/procurement/grn/pr_grn_item.model';
import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface ProcurementMaterialIssueItemAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  material_issue_id: string;
  grn_item_id: string;
  item_code: string;
  item_name: string;
  details?: string | null;
  unit?: string | null;
  quantity: number;
  rate: number;
  amount: number;
  orgId?: number | null;
  projectId?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;

  // Relations
  issue?: ProcurementMaterialIssue;
  grnItem?: ProcurementGrnItem;
  organization?: SysOrganization;
  project?: Project;
}

export interface ProcurementMaterialIssueItemCreationAttributes {
  material_issue_id: string;
  grn_item_id: string;
  item_code: string;
  item_name: string;
  details?: string | null;
  unit?: string | null;
  quantity: number;
  rate: number;
  amount: number;
  orgId?: number | null;
  projectId?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type ProcurementMaterialIssueItemUpdateAttributes = Partial<ProcurementMaterialIssueItemCreationAttributes>;

// Helper type for including relations
export interface ProcurementMaterialIssueItemWithRelations extends ProcurementMaterialIssueItemAttributes {
  issue?: ProcurementMaterialIssue;
  grnItem?: ProcurementGrnItem;
  organization?: SysOrganization;
  project?: Project;
}
