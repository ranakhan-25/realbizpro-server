// Auto-generated types for Employee
// Source: src/database/models/hrm/employee/hrm_employee_model.ts

import { EmployeeStatus } from '../models/hrm/employee/hrm_employee_model';

import type { Attendance } from '../models/hrm/employee/hrm_attendance_model';
import type { BonusGenerate } from '../models/hrm/employee/hrm_bonus_generate_model';

export interface EmployeeAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  employeeCode: string;
  name: string;
  status: EmployeeStatus;

  // Relations
  attendances?: Attendance[];
  bonusGenerates?: BonusGenerate[];
}

export interface EmployeeCreationAttributes {
  employeeCode: string;
  name: string;
  status?: EmployeeStatus; // Has default value
}

export type EmployeeUpdateAttributes = Partial<EmployeeCreationAttributes>;

// Helper type for including relations
export interface EmployeeWithRelations extends EmployeeAttributes {
  attendances?: Attendance[];
  bonusGenerates?: BonusGenerate[];
}
