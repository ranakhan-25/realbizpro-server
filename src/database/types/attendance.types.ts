// Auto-generated types for Attendance
// Source: src/database/models/hrm/employee/hrm_attendance_model.ts

import { AttendanceType } from '../models/hrm/employee/hrm_attendance_model';

import type { EmployeeList } from '../models/hrm/employee/hrm_employeeList_model';
import type { MonthYear } from '../models/hrm/employee/hrm_monthyear_model';
import type { Department } from '../models/hrm/employee/hrm_department_model';
import type { Shift } from '../models/hrm/employee/hrm_shift_model';
import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface AttendanceAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  employeeId: string;
  monthYearId?: string | null;
  departmentId?: string | null;
  shiftId?: string | null;
  date: string;
  day: string;
  inTime?: string | null;
  outTime?: string | null;
  hours?: number | null;
  inSelfie?: string | null;
  outSelfie?: string | null;
  inLocation?: string | null;
  outLocation?: string | null;
  location?: string | null;
  note?: string | null;
  comment?: string | null;
  isPresent: boolean;
  type: AttendanceType;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;

  // Relations
  employee?: EmployeeList;
  monthYear?: MonthYear;
  department?: Department;
  shift?: Shift;
  organization?: SysOrganization;
  project?: Project;
}

export interface AttendanceCreationAttributes {
  employeeId: string;
  monthYearId?: string | null;
  departmentId?: string | null;
  shiftId?: string | null;
  date: string;
  day: string;
  inTime?: string | null;
  outTime?: string | null;
  hours?: number | null;
  inSelfie?: string | null;
  outSelfie?: string | null;
  inLocation?: string | null;
  outLocation?: string | null;
  location?: string | null;
  note?: string | null;
  comment?: string | null;
  isPresent?: boolean; // Has default value
  type?: AttendanceType; // Has default value
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;
}

export type AttendanceUpdateAttributes = Partial<AttendanceCreationAttributes>;

// Helper type for including relations
export interface AttendanceWithRelations extends AttendanceAttributes {
  employee?: EmployeeList;
  monthYear?: MonthYear;
  department?: Department;
  shift?: Shift;
  organization?: SysOrganization;
  project?: Project;
}
