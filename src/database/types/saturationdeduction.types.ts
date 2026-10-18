// Auto-generated types for SaturationDeduction
// Source: src\database\models\hrm\employee\hrm_saturationdeduction_model.ts

import { PaymentType } from '../models/hrm/employee/hrm_payment_enum';

import type { EmployeeList } from '../models/hrm/employee/hrm_employeeList_model';

export interface SaturationDeductionAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  employeeId: string;
  title: string;
  amount: number;
  paymentType?: PaymentType | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;

  // Relations
  employee?: EmployeeList;
}

export interface SaturationDeductionCreationAttributes {
  employeeId: string;
  title: string;
  amount: number;
  paymentType?: PaymentType | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type SaturationDeductionUpdateAttributes = Partial<SaturationDeductionCreationAttributes>;

// Helper type for including relations
export interface SaturationDeductionWithRelations extends SaturationDeductionAttributes {
  employee?: EmployeeList;
}
