// Auto-generated types for AttendanceReconciliation
// Source: src/database/models/hrm/attendance/attendance_reconciliation_model.ts

import { AttendanceReconciliationRequestType } from '../models/hrm/attendance/attendance_reconciliation_model';
import { AttendanceReconciliationStatus } from '../models/hrm/attendance/attendance_reconciliation_model';

import type { EmployeeList } from '../models/hrm/employee/hrm_employeeList_model';
import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface AttendanceReconciliationAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  employeeId: string;
  date: string;
  lateMinutes: number;
  requestType: AttendanceReconciliationRequestType;
  reason?: string | null;
  attachment?: string | null;
  status: AttendanceReconciliationStatus;
  approvedBy?: string | null;
  isApproved: boolean;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;

  // Relations
  employee?: EmployeeList;
  organization?: SysOrganization;
  project?: Project;
}

export interface AttendanceReconciliationCreationAttributes {
  employeeId: string;
  date: string;
  lateMinutes?: number; // Has default value
  requestType: AttendanceReconciliationRequestType;
  reason?: string | null;
  attachment?: string | null;
  status?: AttendanceReconciliationStatus; // Has default value
  approvedBy?: string | null;
  isApproved?: boolean; // Has default value
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;
}

export type AttendanceReconciliationUpdateAttributes = Partial<AttendanceReconciliationCreationAttributes>;

// Helper type for including relations
export interface AttendanceReconciliationWithRelations extends AttendanceReconciliationAttributes {
  employee?: EmployeeList;
  organization?: SysOrganization;
  project?: Project;
}
