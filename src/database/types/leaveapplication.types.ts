// Auto-generated types for LeaveApplication
// Source: src/database/models/hrm/leaveapplication/leaveapplication_modes.ts

import { LeaveApplicationStatus } from '../models/hrm/leaveapplication/leaveapplication_modes';

import type { EmployeeList } from '../models/hrm/employee/hrm_employeeList_model';
import type { LeaveType } from '../models/hrm/configuration/leave_type_list';
import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface LeaveApplicationAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  employeeId: string;
  leaveTypeId: string;
  allocatedDays?: number | null;
  balanceDays?: number | null;
  fromDate: string;
  toDate: string;
  reason: string;
  status: LeaveApplicationStatus;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;

  // Relations
  employee?: EmployeeList;
  leaveType?: LeaveType;
  organization?: SysOrganization;
  project?: Project;
}

export interface LeaveApplicationCreationAttributes {
  employeeId: string;
  leaveTypeId: string;
  allocatedDays?: number | null;
  balanceDays?: number | null;
  fromDate: string;
  toDate: string;
  reason: string;
  status?: LeaveApplicationStatus; // Has default value
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;
}

export type LeaveApplicationUpdateAttributes = Partial<LeaveApplicationCreationAttributes>;

// Helper type for including relations
export interface LeaveApplicationWithRelations extends LeaveApplicationAttributes {
  employee?: EmployeeList;
  leaveType?: LeaveType;
  organization?: SysOrganization;
  project?: Project;
}
