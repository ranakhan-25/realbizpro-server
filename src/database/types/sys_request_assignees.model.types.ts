// Auto-generated types for SysRequestAssignee
// Source: src/database/models/deligation/sys_request_assignees.model.ts

import type { SysApprovalRequest } from '../models/deligation/sys_approval_requests.model';
import type { SysApprovalStep } from '../models/deligation/sys_approval_steps.model';
import type { SysUser } from '../models/system/sys_user.model';

export interface SysRequestAssigneeAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  requestId: number;
  stepId: number;
  stepNumber: number;
  assignedTo: number;
  delegatedFrom?: number | null;
  status: string;
  actionAt?: Date | null;
  actionComment?: string | null;

  // Relations
  request?: SysApprovalRequest;
  step?: SysApprovalStep;
  assignedUser?: SysUser;
  delegatedFromUser?: SysUser;
}

export interface SysRequestAssigneeCreationAttributes {
  requestId: number;
  stepId: number;
  stepNumber: number;
  assignedTo: number;
  delegatedFrom?: number | null;
  status?: string; // Has default value
  actionAt?: Date | null;
  actionComment?: string | null;
}

export type SysRequestAssigneeUpdateAttributes = Partial<SysRequestAssigneeCreationAttributes>;

// Helper type for including relations
export interface SysRequestAssigneeWithRelations extends SysRequestAssigneeAttributes {
  request?: SysApprovalRequest;
  step?: SysApprovalStep;
  assignedUser?: SysUser;
  delegatedFromUser?: SysUser;
}
