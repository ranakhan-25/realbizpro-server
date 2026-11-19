// Auto-generated types for DeductionRule
// Source: src/database/models/hrm/configuration/deduction_rule_model.ts

import { DeductionRuleType } from '../models/hrm/configuration/deduction_rule_model';

import type { SysOrganization } from '../models/system/sys_organization.model';

export interface DeductionRuleAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  type: DeductionRuleType;
  title: string;
  lateTime: number;
  lateDays: number;
  deductionDays: number;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;

  // Relations
  organization?: SysOrganization;
}

export interface DeductionRuleCreationAttributes {
  type: DeductionRuleType;
  title: string;
  lateTime: number;
  lateDays: number;
  deductionDays: number;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
}

export type DeductionRuleUpdateAttributes = Partial<DeductionRuleCreationAttributes>;

// Helper type for including relations
export interface DeductionRuleWithRelations extends DeductionRuleAttributes {
  organization?: SysOrganization;
}
