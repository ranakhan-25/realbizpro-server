// Auto-generated types for SysApprovalWorkflow
// Source: src\database\models\deligation\sys_approval_workflows.model.ts

import type { SysApprovalStep } from '../models/deligation/sys_approval_steps.model';
import type { SysDelegationStatus } from '../models/deligation/sys_delegation_statuses.model';

export interface SysApprovalWorkflowAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  workflowName: string;
  slug: string;
  sessionVariable?: string | null;
  draftStatusId?: number | null;
  initiateApproveStatusId?: number | null;
  afterApproveStatusId?: number | null;
  afterDeclineStatusId?: number | null;
  refDbTableName?: string | null;
  refIdField?: string | null;
  refStatusField?: string | null;
  afterRejectStatusId?: number | null;
  callbackUrl?: string | null;
  isActive: boolean;

  // Relations
  steps?: SysApprovalStep[];
  draftStatus?: SysDelegationStatus;
  initiateApproveStatus?: SysDelegationStatus;
  afterApproveStatus?: SysDelegationStatus;
  afterRejectStatus?: SysDelegationStatus;
  afterDeclineStatus?: SysDelegationStatus;
  status?: SysDelegationStatus;
}

export interface SysApprovalWorkflowCreationAttributes {
  workflowName: string;
  slug: string;
  sessionVariable?: string | null;
  draftStatusId?: number | null;
  initiateApproveStatusId?: number | null;
  afterApproveStatusId?: number | null;
  afterDeclineStatusId?: number | null;
  refDbTableName?: string | null;
  refIdField?: string | null;
  refStatusField?: string | null;
  afterRejectStatusId?: number | null;
  callbackUrl?: string | null;
  isActive?: boolean; // Has default value
}

export type SysApprovalWorkflowUpdateAttributes = Partial<SysApprovalWorkflowCreationAttributes>;

// Helper type for including relations
export interface SysApprovalWorkflowWithRelations extends SysApprovalWorkflowAttributes {
  steps?: SysApprovalStep[];
  draftStatus?: SysDelegationStatus;
  initiateApproveStatus?: SysDelegationStatus;
  afterApproveStatus?: SysDelegationStatus;
  afterRejectStatus?: SysDelegationStatus;
  afterDeclineStatus?: SysDelegationStatus;
  status?: SysDelegationStatus;
}
