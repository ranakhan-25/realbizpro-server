// Auto-generated types for EmployeeType
// Source: src\database\models\hrm\employee\hrm_employee_type-model.ts

import { EmployeeTypeStatus } from '../models/hrm/employee/hrm_employee_type-model';

export interface EmployeeTypeAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  name: string;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  status: EmployeeTypeStatus;
}

export interface EmployeeTypeCreationAttributes {
  name: string;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  status?: EmployeeTypeStatus; // Has default value
}

export type EmployeeTypeUpdateAttributes = Partial<EmployeeTypeCreationAttributes>;

// Helper type for including relations
export interface EmployeeTypeWithRelations extends EmployeeTypeAttributes {
  // No relations defined
}
