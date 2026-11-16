// Auto-generated types for Increment
// Source: src\database\models\hrm\employee\hrm_increment_model.ts

import { IncrementStatus } from '../models/hrm/employee/hrm_increment_model';

import type { EmployeeList } from '../models/hrm/employee/hrm_employeeList_model';
import type { Designation } from '../models/hrm/employee/hrm_designation_model';
import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface IncrementAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  date: string;
  employeeId: string;
  designationId: string;
  amount: number;
  status: IncrementStatus;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;

  // Relations
  employee?: EmployeeList;
  designation?: Designation;
  organization?: SysOrganization;
  project?: Project;
}

export interface IncrementCreationAttributes {
  date: string;
  employeeId: string;
  designationId: string;
  amount: number;
  status?: IncrementStatus; // Has default value
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;
}

export type IncrementUpdateAttributes = Partial<IncrementCreationAttributes>;

// Helper type for including relations
export interface IncrementWithRelations extends IncrementAttributes {
  employee?: EmployeeList;
  designation?: Designation;
  organization?: SysOrganization;
  project?: Project;
}
