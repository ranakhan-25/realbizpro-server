// Auto-generated types for Attendance
// Source: src\database\models\hrm\employee\hrm_attendance_model.ts

import { AttendanceType } from '../models/hrm/employee/hrm_attendance_model';

import type { EmployeeList } from '../models/hrm/employee/hrm_employeeList_model';
import type { MonthYear } from '../models/hrm/employee/hrm_monthyear_model';

export interface AttendanceAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  employeeId: string;
  monthYearId?: string | null;
  date: string;
  day: string;
  inTime?: string | null;
  outTime?: string | null;
  note?: string | null;
  type: AttendanceType;

  // Relations
  employee?: EmployeeList;
  monthYear?: MonthYear;
}

export interface AttendanceCreationAttributes {
  employeeId: string;
  monthYearId?: string | null;
  date: string;
  day: string;
  inTime?: string | null;
  outTime?: string | null;
  note?: string | null;
  type?: AttendanceType; // Has default value
}

export type AttendanceUpdateAttributes = Partial<AttendanceCreationAttributes>;

// Helper type for including relations
export interface AttendanceWithRelations extends AttendanceAttributes {
  employee?: EmployeeList;
  monthYear?: MonthYear;
}
