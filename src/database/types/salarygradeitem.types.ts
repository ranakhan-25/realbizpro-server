// Auto-generated types for SalaryGradeItem
// Source: src/database/models/hrm/configuration/hrm_salary_grade_item_model.ts

import { SalaryGradeItemType } from '../models/hrm/configuration/hrm_salary_grade_item_model';

import type { AllowanceDeductionSetup } from '../models/hrm/configuration/allowance_deducation_setup';
import type { SysOrganization } from '../models/system/sys_organization.model';

export interface SalaryGradeItemAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  setupId?: string | null;
  basicSalary: number;
  type: SalaryGradeItemType;
  name: string;
  percent: number;
  amount: number;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;

  // Relations
  setup?: AllowanceDeductionSetup;
  organization?: SysOrganization;
}

export interface SalaryGradeItemCreationAttributes {
  setupId?: string | null;
  basicSalary?: number; // Has default value
  type: SalaryGradeItemType;
  name: string;
  percent?: number; // Has default value
  amount?: number; // Has default value
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
}

export type SalaryGradeItemUpdateAttributes = Partial<SalaryGradeItemCreationAttributes>;

// Helper type for including relations
export interface SalaryGradeItemWithRelations extends SalaryGradeItemAttributes {
  setup?: AllowanceDeductionSetup;
  organization?: SysOrganization;
}
