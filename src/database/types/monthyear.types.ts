// Auto-generated types for MonthYear
// Source: src\database\models\hrm\employee\hrm_monthyear_model.ts

import type { Attendance } from '../models/hrm/employee/hrm_attendance_model';
import type { SysOrganization } from '../models/system/sys_organization.model';

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
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;

  // Relations
  attendances?: Attendance[];
  organization?: SysOrganization;
}

export interface MonthYearCreationAttributes {
  month: string;
  year: number;
  startDate: string;
  endDate: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
}

export type MonthYearUpdateAttributes = Partial<MonthYearCreationAttributes>;

// Helper type for including relations
export interface MonthYearWithRelations extends MonthYearAttributes {
  attendances?: Attendance[];
  organization?: SysOrganization;
}
