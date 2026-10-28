// Auto-generated types for SysApprovalHistory
// Source: src/database/models/deligation/sys_approval_history.model.ts

import type { SysApprovalRequest } from '../models/deligation/sys_approval_requests.model';
import type { SysUser } from '../models/system/sys_user.model';
import type { SysApprovalStep } from '../models/deligation/sys_approval_steps.model';
import type { SysDelegationStatus } from '../models/deligation/sys_delegation_statuses.model';

export interface SysApprovalHistoryAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  requestId: number;
  stepId: number;
  actionStatusId: number;
  comments?: string | null;
  ipAddress?: string | null;
  actionTimestamp: Date;
  createdBy: number;

  // Relations
  request?: SysApprovalRequest;
  createdByUser: SysUser;
  step?: SysApprovalStep;
  actionStatus?: SysDelegationStatus;
}

export interface SysApprovalHistoryCreationAttributes {
  requestId: number;
  stepId: number;
  actionStatusId: number;
  comments?: string | null;
  ipAddress?: string | null;
  actionTimestamp?: Date; // Has default value
  createdBy: number;
}

export type SysApprovalHistoryUpdateAttributes = Partial<SysApprovalHistoryCreationAttributes>;

// Helper type for including relations
export interface SysApprovalHistoryWithRelations extends SysApprovalHistoryAttributes {
  request?: SysApprovalRequest;
  createdByUser: SysUser;
  step?: SysApprovalStep;
  actionStatus?: SysDelegationStatus;
}
