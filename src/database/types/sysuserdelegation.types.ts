// Auto-generated types for SysUserDelegation
// Source: src/database/models/deligation/sys_user_delegations.model.ts

import type { SysUser } from '../models/system/sys_user.model';
import type { SysApprovalWorkflow } from '../models/deligation/sys_approval_workflows.model';

export interface SysUserDelegationAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  delegatorId: number;
  delegateId: number;
  startAt: Date;
  endAt: Date;
  workflowId?: number | null;
  reason?: string | null;
  status: string;

  // Relations
  delegator?: SysUser;
  delegate?: SysUser;
  workflow?: SysApprovalWorkflow;
}

export interface SysUserDelegationCreationAttributes {
  delegatorId: number;
  delegateId: number;
  startAt: Date;
  endAt: Date;
  workflowId?: number | null;
  reason?: string | null;
  status?: string; // Has default value
}

export type SysUserDelegationUpdateAttributes = Partial<SysUserDelegationCreationAttributes>;

// Helper type for including relations
export interface SysUserDelegationWithRelations extends SysUserDelegationAttributes {
  delegator?: SysUser;
  delegate?: SysUser;
  workflow?: SysApprovalWorkflow;
}
