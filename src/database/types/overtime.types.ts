// Auto-generated types for Overtime
// Source: src/database/models/hrm/employee/hrm_overtime_model.ts

import type { EmployeeList } from '../models/hrm/employee/hrm_employeeList_model';

export interface OvertimeAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  employeeId: string;
  title: string;
  type?: string | null;
  amount: number;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;

  // Relations
  employee?: EmployeeList;
}

export interface OvertimeCreationAttributes {
  employeeId: string;
  title: string;
  type?: string | null;
  amount?: number; // Has default value
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type OvertimeUpdateAttributes = Partial<OvertimeCreationAttributes>;

// Helper type for including relations
export interface OvertimeWithRelations extends OvertimeAttributes {
  employee?: EmployeeList;
}
