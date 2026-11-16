// Auto-generated types for Unit
// Source: src/database/models/hrm/employee/hrm_unit_model.ts

import { UnitStatus } from '../models/hrm/employee/hrm_unit_model';

import type { EmployeeList } from '../models/hrm/employee/hrm_employeeList_model';
import type { SysOrganization } from '../models/system/sys_organization.model';

export interface UnitAttributes {
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
  status: UnitStatus;
  orgId?: number | null;

  // Relations
  employees?: EmployeeList[];
  organization?: SysOrganization;
}

export interface UnitCreationAttributes {
  name: string;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  status?: UnitStatus; // Has default value
  orgId?: number | null;
}

export type UnitUpdateAttributes = Partial<UnitCreationAttributes>;

// Helper type for including relations
export interface UnitWithRelations extends UnitAttributes {
  employees?: EmployeeList[];
  organization?: SysOrganization;
}
