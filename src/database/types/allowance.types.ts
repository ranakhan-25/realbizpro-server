// Auto-generated types for Allowance
// Source: src\database\models\hrm\employee\hrm_allowance_model.ts

import { AllowanceType } from '../models/hrm/employee/hrm_payment_enum';
import { PaymentType } from '../models/hrm/employee/hrm_payment_enum';

import type { EmployeeList } from '../models/hrm/employee/hrm_employeeList_model';

export interface AllowanceAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  employeeId: string;
  purpose: string;
  type: AllowanceType;
  paymentType: PaymentType;
  percentage?: number | null;
  amount: number;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;

  // Relations
  employee?: EmployeeList;
}

export interface AllowanceCreationAttributes {
  employeeId: string;
  purpose: string;
  type: AllowanceType;
  paymentType: PaymentType;
  percentage?: number | null;
  amount?: number; // Has default value
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type AllowanceUpdateAttributes = Partial<AllowanceCreationAttributes>;

// Helper type for including relations
export interface AllowanceWithRelations extends AllowanceAttributes {
  employee?: EmployeeList;
}
