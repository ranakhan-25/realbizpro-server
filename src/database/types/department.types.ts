// Auto-generated types for Department
// Source: src\database\models\hrm\employee\hrm_department_model.ts

import { DepartmentStatus } from '../models/hrm/employee/hrm_department_model';

import type { Designation } from '../models/hrm/employee/hrm_designation_model';
import type { EmployeeList } from '../models/hrm/employee/hrm_employeeList_model';
import type { Attendance } from '../models/hrm/employee/hrm_attendance_model';

export interface DepartmentAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  name: string;
  departmentHeadId?: string | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  status: DepartmentStatus;

  // Relations
  designations?: Designation[];
  employees?: EmployeeList[];
  attendances?: Attendance[];
}

export interface DepartmentCreationAttributes {
  name: string;
  departmentHeadId?: string | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  status?: DepartmentStatus; // Has default value
}

export type DepartmentUpdateAttributes = Partial<DepartmentCreationAttributes>;

// Helper type for including relations
export interface DepartmentWithRelations extends DepartmentAttributes {
  designations?: Designation[];
  employees?: EmployeeList[];
  attendances?: Attendance[];
}
