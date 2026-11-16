// Auto-generated types for EmployeeType
// Source: src/database/models/hrm/employee/hrm_employee_type-model.ts

import { EmployeeTypeStatus } from '../models/hrm/employee/hrm_employee_type-model';

import type { SysOrganization } from '../models/system/sys_organization.model';

export interface EmployeeTypeAttributes {
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
  status: EmployeeTypeStatus;
  orgId?: number | null;

  // Relations
  organization?: SysOrganization;
}

export interface EmployeeTypeCreationAttributes {
  name: string;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  status?: EmployeeTypeStatus; // Has default value
  orgId?: number | null;
}

export type EmployeeTypeUpdateAttributes = Partial<EmployeeTypeCreationAttributes>;

// Helper type for including relations
export interface EmployeeTypeWithRelations extends EmployeeTypeAttributes {
  organization?: SysOrganization;
}
