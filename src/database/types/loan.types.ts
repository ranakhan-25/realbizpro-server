// Auto-generated types for Loan
// Source: src/database/models/hrm/employee/hrm_loan_model.ts

import type { EmployeeList } from '../models/hrm/employee/hrm_employeeList_model';

export interface LoanAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  employeeId: string;
  type: string;
  amount: number;
  startDate: string;
  endDate?: string | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;

  // Relations
  employee?: EmployeeList;
}

export interface LoanCreationAttributes {
  employeeId: string;
  type: string;
  amount: number;
  startDate: string;
  endDate?: string | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type LoanUpdateAttributes = Partial<LoanCreationAttributes>;

// Helper type for including relations
export interface LoanWithRelations extends LoanAttributes {
  employee?: EmployeeList;
}
