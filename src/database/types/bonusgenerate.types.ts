// Auto-generated types for BonusGenerate
// Source: src\database\models\hrm\employee\hrm_bonus_generate_model.ts

import { BonusGenerateStatus } from '../models/hrm/employee/hrm_bonus_generate_model';

import type { Bonus } from '../models/hrm/employee/hrm_bonus_model';
import type { EmployeeList } from '../models/hrm/employee/hrm_employeeList_model';
import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface BonusGenerateAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  bonusId: string;
  employeeId: string;
  amount: number;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  status: BonusGenerateStatus;
  orgId?: number | null;
  projectId?: string | null;

  // Relations
  bonus?: Bonus;
  employee?: EmployeeList;
  organization?: SysOrganization;
  project?: Project;
}

export interface BonusGenerateCreationAttributes {
  bonusId: string;
  employeeId: string;
  amount: number;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  status?: BonusGenerateStatus; // Has default value
  orgId?: number | null;
  projectId?: string | null;
}

export type BonusGenerateUpdateAttributes = Partial<BonusGenerateCreationAttributes>;

// Helper type for including relations
export interface BonusGenerateWithRelations extends BonusGenerateAttributes {
  bonus?: Bonus;
  employee?: EmployeeList;
  organization?: SysOrganization;
  project?: Project;
}
