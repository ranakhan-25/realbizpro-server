// Auto-generated types for SysApprovalStep
// Source: src/database/models/deligation/sys_approval_steps.model.ts

import type { SysApprovalWorkflow } from '../models/deligation/sys_approval_workflows.model';
import type { SysStepApprover } from '../models/deligation/sys_step_approvers.model';

export interface SysApprovalStepAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  workflowId: number;
  stepNumber: number;
  stepName?: string | null;
  ruleType: string;
  requiredCount?: number | null;
  isFinal: boolean;
  slaHours?: number | null;
  escalationUserId?: number | null;
  isActive: boolean;
  escalationHours?: number | null;
  escalationToUserId?: number | null;

  // Relations
  workflow?: SysApprovalWorkflow;
  approvers?: SysStepApprover[];
}

export interface SysApprovalStepCreationAttributes {
  workflowId: number;
  stepNumber: number;
  stepName?: string | null;
  ruleType: string;
  requiredCount?: number | null;
  isFinal?: boolean; // Has default value
  slaHours?: number | null;
  escalationUserId?: number | null;
  isActive?: boolean; // Has default value
  escalationHours?: number | null;
  escalationToUserId?: number | null;
}

export type SysApprovalStepUpdateAttributes = Partial<SysApprovalStepCreationAttributes>;

// Helper type for including relations
export interface SysApprovalStepWithRelations extends SysApprovalStepAttributes {
  workflow?: SysApprovalWorkflow;
  approvers?: SysStepApprover[];
}
