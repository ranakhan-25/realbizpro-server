// Auto-generated types for Shift
// Source: src\database\models\hrm\employee\hrm_shift_model.ts

import { ShiftStatus } from '../models/hrm/employee/hrm_shift_model';

import type { ShiftSchedule } from '../models/hrm/employee/hrm_shift_schedule_model';

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

  // Relations
  schedules?: ShiftSchedule[];
}

export interface ShiftCreationAttributes {
  name: string;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  status?: ShiftStatus; // Has default value
}

export type ShiftUpdateAttributes = Partial<ShiftCreationAttributes>;

// Helper type for including relations
export interface ShiftWithRelations extends ShiftAttributes {
  schedules?: ShiftSchedule[];
}
