// Auto-generated types for AllowanceDeductionSetup
// Source: src/database/models/hrm/configuration/allowance_deducation_setup.ts

import { SetupTypeEnum } from '../models/hrm/configuration/allowance_deducation_setup';
import { PaymentTypeEnum } from '../models/hrm/configuration/allowance_deducation_setup';

import type { SalaryGradeItem } from '../models/hrm/configuration/hrm_salary_grade_item_model';
import type { SysOrganization } from '../models/system/sys_organization.model';

export interface AllowanceDeductionSetupAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  type: SetupTypeEnum;
  name: string;
  paymentType: PaymentTypeEnum;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;

  // Relations
  gradeItems?: SalaryGradeItem[];
  organization?: SysOrganization;
}

export interface AllowanceDeductionSetupCreationAttributes {
  type: SetupTypeEnum;
  name: string;
  paymentType: PaymentTypeEnum;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
}

export type AllowanceDeductionSetupUpdateAttributes = Partial<AllowanceDeductionSetupCreationAttributes>;

// Helper type for including relations
export interface AllowanceDeductionSetupWithRelations extends AllowanceDeductionSetupAttributes {
  gradeItems?: SalaryGradeItem[];
  organization?: SysOrganization;
}
