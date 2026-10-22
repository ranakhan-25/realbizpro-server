// Auto-generated types for MonthYear
// Source: src\database\models\hrm\employee\hrm_monthyear_model.ts

import type { Attendance } from '../models/hrm/employee/hrm_attendance_model';

export interface MonthYearAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  month: string;
  year: number;
  startDate: string;
  endDate: string;

  // Relations
  attendances?: Attendance[];
}

export interface MonthYearCreationAttributes {
  month: string;
  year: number;
  startDate: string;
  endDate: string;
}

export type MonthYearUpdateAttributes = Partial<MonthYearCreationAttributes>;

// Helper type for including relations
export interface MonthYearWithRelations extends MonthYearAttributes {
  attendances?: Attendance[];
}
