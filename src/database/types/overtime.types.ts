// Auto-generated types for Overtime
// Source: src\database\models\hrm\employee\hrm_overtime_model.ts

import type { EmployeeList } from '../models/hrm/employee/hrm_employeeList_model';
import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface OvertimeAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  employeeId: string;
  title: string;
  type?: string | null;
  amount: number;
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

export interface OvertimeCreationAttributes {
  employeeId: string;
  title: string;
  type?: string | null;
  amount?: number; // Has default value
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;
}

export type OvertimeUpdateAttributes = Partial<OvertimeCreationAttributes>;

// Helper type for including relations
export interface OvertimeWithRelations extends OvertimeAttributes {
  employee?: EmployeeList;
  organization?: SysOrganization;
  project?: Project;
}
