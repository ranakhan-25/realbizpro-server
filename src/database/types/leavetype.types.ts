// Auto-generated types for LeaveType
// Source: src/database/models/hrm/configuration/leave_type_list.ts

import { LeaveTypeStatus } from '../models/hrm/configuration/leave_type_list';

import type { LeaveApplication } from '../models/hrm/leaveapplication/leaveapplication_modes';
import type { SysOrganization } from '../models/system/sys_organization.model';

export interface LeaveTypeAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  name: string;
  allocationDay: number;
  status: LeaveTypeStatus;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;

  // Relations
  leaveApplications?: LeaveApplication[];
  organization?: SysOrganization;
}

export interface LeaveTypeCreationAttributes {
  name: string;
  allocationDay?: number; // Has default value
  status?: LeaveTypeStatus; // Has default value
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
}

export type LeaveTypeUpdateAttributes = Partial<LeaveTypeCreationAttributes>;

// Helper type for including relations
export interface LeaveTypeWithRelations extends LeaveTypeAttributes {
  leaveApplications?: LeaveApplication[];
  organization?: SysOrganization;
}
