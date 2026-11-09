// Auto-generated types for Loan
// Source: src\database\models\hrm\employee\hrm_loan_model.ts

import type { EmployeeList } from '../models/hrm/employee/hrm_employeeList_model';
import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface LoanAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  employeeId: string;
  type: string;
  amount: number;
  startDate: string;
  endDate?: string | null;
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

export interface LoanCreationAttributes {
  employeeId: string;
  type: string;
  amount: number;
  startDate: string;
  endDate?: string | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;
}

export type LoanUpdateAttributes = Partial<LoanCreationAttributes>;

// Helper type for including relations
export interface LoanWithRelations extends LoanAttributes {
  employee?: EmployeeList;
  organization?: SysOrganization;
  project?: Project;
}
