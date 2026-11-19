// Auto-generated types for ShiftSchedule
// Source: src/database/models/hrm/employee/hrm_shift_schedule_model.ts

import { ShiftDayName } from '../models/hrm/employee/hrm_shift_schedule_model';

import type { Shift } from '../models/hrm/employee/hrm_shift_model';
import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

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
  orgId?: number | null;
  projectId?: string | null;

  // Relations
  shift?: Shift;
  organization?: SysOrganization;
  project?: Project;
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
  orgId?: number | null;
  projectId?: string | null;
}

export type ShiftScheduleUpdateAttributes = Partial<ShiftScheduleCreationAttributes>;

// Helper type for including relations
export interface ShiftScheduleWithRelations extends ShiftScheduleAttributes {
  shift?: Shift;
  organization?: SysOrganization;
  project?: Project;
}
