// Auto-generated types for CsBuildingIncome
// Source: src/database/models/customer-service/cs_building_income.model.ts

import { BuildingIncomeType } from '../models/customer-service/cs_service_charge.types';

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface CsBuildingIncomeAttributes {
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
  incomeType: BuildingIncomeType;
  title: string;
  amount: number;
  incomeDate: string;
  receivedFrom?: string | null;
  sourceReference?: string | null;
  notes?: string | null;

  // Relations
  organization?: SysOrganization;
  project?: Project;
}

export interface CsBuildingIncomeCreationAttributes {
  organizationId: number;
  createdBy?: number | null;
  updatedBy?: number | null;
  deletedBy?: number | null;
  projectId: string;
  incomeType: BuildingIncomeType;
  title: string;
  amount?: number; // Has default value
  incomeDate: string;
  receivedFrom?: string | null;
  sourceReference?: string | null;
  notes?: string | null;
}

export type CsBuildingIncomeUpdateAttributes = Partial<CsBuildingIncomeCreationAttributes>;

// Helper type for including relations
export interface CsBuildingIncomeWithRelations extends CsBuildingIncomeAttributes {
  organization?: SysOrganization;
  project?: Project;
}
