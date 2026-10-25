// Auto-generated types for Commission
// Source: src\database\models\hrm\employee\hrm_commission_model.ts

import type { EmployeeList } from '../models/hrm/employee/hrm_employeeList_model';

export interface CommissionAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  employeeId: string;
  type?: string | null;
  commissionType?: string | null;
  title: string;
  value?: string | null;
  amount: number;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;

  // Relations
  employee?: EmployeeList;
}

export interface CommissionCreationAttributes {
  employeeId: string;
  type?: string | null;
  commissionType?: string | null;
  title: string;
  value?: string | null;
  amount?: number; // Has default value
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type CommissionUpdateAttributes = Partial<CommissionCreationAttributes>;

// Helper type for including relations
export interface CommissionWithRelations extends CommissionAttributes {
  employee?: EmployeeList;
}
