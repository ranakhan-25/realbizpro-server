// Auto-generated types for SysStepApprover
// Source: src\database\models\deligation\sys_step_approvers.model.ts

import { ApproverType } from '../models/deligation/sys_step_approvers.model';
import { ConditionOperator } from '../models/deligation/sys_step_approvers.model';

import type { SysUser } from '../models/system/sys_user.model';
import type { SysApprovalStep } from '../models/deligation/sys_approval_steps.model';

export interface SysStepApproverAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  stepId: number;
  userId?: number | null;
  approverType: ApproverType;
  conditionField?: string | null;
  conditionOperator?: ConditionOperator | null;
  conditionValue?: string | null;
  priority: number;
  conditionFieldTableName?: string | null;
  conditionFieldUserFieldName?: string | null;
  isActive: boolean;

  // Relations
  user?: SysUser;
  step?: SysApprovalStep;
}

export interface SysStepApproverCreationAttributes {
  stepId: number;
  userId?: number | null;
  approverType?: ApproverType; // Has default value
  conditionField?: string | null;
  conditionOperator?: ConditionOperator | null;
  conditionValue?: string | null;
  priority?: number; // Has default value
  conditionFieldTableName?: string | null;
  conditionFieldUserFieldName?: string | null;
  isActive?: boolean; // Has default value
}

export type SysStepApproverUpdateAttributes = Partial<SysStepApproverCreationAttributes>;

// Helper type for including relations
export interface SysStepApproverWithRelations extends SysStepApproverAttributes {
  user?: SysUser;
  step?: SysApprovalStep;
}
