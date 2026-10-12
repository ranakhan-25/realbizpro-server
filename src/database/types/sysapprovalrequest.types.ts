// Auto-generated types for SysApprovalRequest
// Source: src/database/models/deligation/sys_approval_requests.model.ts

import type { SysApprovalStep } from '../models/deligation/sys_approval_steps.model';
import type { SysApprovalWorkflow } from '../models/deligation/sys_approval_workflows.model';
import type { SysDelegationStatus } from '../models/deligation/sys_delegation_statuses.model';
import type { SysApprovalHistory } from '../models/deligation/sys_approval_history.model';
import type { SysRequestAssignee } from '../models/deligation/sys_approval_request_assingees.model';

export interface SysApprovalRequestAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  workflowId: number;
  referenceId: number;
  referenceTable?: string | null;
  currentStep: number;
  statusId: number;
  requestedBy: number;
  sessionVariables?: object | null;
  remarks?: string | null;

  // Relations
  currentApprovalStep?: SysApprovalStep;
  workflow?: SysApprovalWorkflow;
  status?: SysDelegationStatus;
  history?: SysApprovalHistory[];
  assignees?: SysRequestAssignee[];
}

export interface SysApprovalRequestCreationAttributes {
  workflowId: number;
  referenceId: number;
  referenceTable?: string | null;
  currentStep: number;
  statusId: number;
  requestedBy: number;
  sessionVariables?: object | null;
  remarks?: string | null;
}

export type SysApprovalRequestUpdateAttributes = Partial<SysApprovalRequestCreationAttributes>;

// Helper type for including relations
export interface SysApprovalRequestWithRelations extends SysApprovalRequestAttributes {
  currentApprovalStep?: SysApprovalStep;
  workflow?: SysApprovalWorkflow;
  status?: SysDelegationStatus;
  history?: SysApprovalHistory[];
  assignees?: SysRequestAssignee[];
}
