// Auto-generated types for CsBuildingExpense
// Source: src/database/models/customer-service/cs_building_expense.model.ts

import { BuildingExpenseType } from '../models/customer-service/cs_service_charge.types';

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface CsBuildingExpenseAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  organizationId: number;
  createdBy?: number | null;
  updatedBy?: number | null;
  deletedBy?: number | null;
  projectId: string;
  expenseType: BuildingExpenseType;
  title: string;
  vendorName?: string | null;
  amount: number;
  expenseDate: string;
  invoiceReference?: string | null;
  paymentStatus: 'PAID' | 'PENDING';
  notes?: string | null;

  // Relations
  organization?: SysOrganization;
  project?: Project;
}

export interface CsBuildingExpenseCreationAttributes {
  organizationId: number;
  createdBy?: number | null;
  updatedBy?: number | null;
  deletedBy?: number | null;
  projectId: string;
  expenseType: BuildingExpenseType;
  title: string;
  vendorName?: string | null;
  amount?: number; // Has default value
  expenseDate: string;
  invoiceReference?: string | null;
  paymentStatus?: 'PAID' | 'PENDING'; // Has default value
  notes?: string | null;
}

export type CsBuildingExpenseUpdateAttributes = Partial<CsBuildingExpenseCreationAttributes>;

// Helper type for including relations
export interface CsBuildingExpenseWithRelations extends CsBuildingExpenseAttributes {
  organization?: SysOrganization;
  project?: Project;
}
