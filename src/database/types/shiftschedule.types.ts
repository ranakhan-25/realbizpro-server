// Auto-generated types for ShiftSchedule
// Source: src\database\models\hrm\employee\hrm_shift_schedule_model.ts

import { ShiftDayName } from '../models/hrm/employee/hrm_shift_schedule_model';

import type { Shift } from '../models/hrm/employee/hrm_shift_model';

export interface ShiftScheduleAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  shiftId: string;
  day: ShiftDayName;
  enabled: boolean;
  fromTime?: string | null;
  toTime?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;

  // Relations
  shift?: Shift;
}

export interface ShiftScheduleCreationAttributes {
  shiftId: string;
  day: ShiftDayName;
  enabled?: boolean; // Has default value
  fromTime?: string | null;
  toTime?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type ShiftScheduleUpdateAttributes = Partial<ShiftScheduleCreationAttributes>;

// Helper type for including relations
export interface ShiftScheduleWithRelations extends ShiftScheduleAttributes {
  shift?: Shift;
}
