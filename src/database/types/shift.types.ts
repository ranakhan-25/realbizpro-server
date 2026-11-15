// Auto-generated types for Shift
// Source: src\database\models\hrm\employee\hrm_shift_model.ts

import { ShiftStatus } from '../models/hrm/employee/hrm_shift_model';

import type { ShiftSchedule } from '../models/hrm/employee/hrm_shift_schedule_model';
import type { Attendance } from '../models/hrm/employee/hrm_attendance_model';
import type { SysOrganization } from '../models/system/sys_organization.model';

export interface ShiftAttributes {
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
  status: ShiftStatus;
  orgId?: number | null;

  // Relations
  schedules?: ShiftSchedule[];
  attendances?: Attendance[];
  organization?: SysOrganization;
}

export interface ShiftCreationAttributes {
  name: string;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  status?: ShiftStatus; // Has default value
  orgId?: number | null;
}

export type ShiftUpdateAttributes = Partial<ShiftCreationAttributes>;

// Helper type for including relations
export interface ShiftWithRelations extends ShiftAttributes {
  schedules?: ShiftSchedule[];
  attendances?: Attendance[];
  organization?: SysOrganization;
}
