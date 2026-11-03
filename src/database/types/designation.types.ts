// Auto-generated types for Designation
// Source: src/database/models/hrm/employee/hrm_designation_model.ts

import { DesignationStatus } from '../models/hrm/employee/hrm_designation_model';

import type { Department } from '../models/hrm/employee/hrm_department_model';
import type { EmployeeList } from '../models/hrm/employee/hrm_employeeList_model';
import type { Increment } from '../models/hrm/employee/hrm_increment_model';

export interface DesignationAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  name: string;
  departmentId: string;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  status: DesignationStatus;

  // Relations
  department?: Department;
  employees?: EmployeeList[];
  increments?: Increment[];
}

export interface DesignationCreationAttributes {
  name: string;
  departmentId: string;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  status?: DesignationStatus; // Has default value
}

export type DesignationUpdateAttributes = Partial<DesignationCreationAttributes>;

// Helper type for including relations
export interface DesignationWithRelations extends DesignationAttributes {
  department?: Department;
  employees?: EmployeeList[];
  increments?: Increment[];
}
