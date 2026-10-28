// Auto-generated types for BonusGenerate
// Source: src/database/models/hrm/employee/hrm_bonus_generate_model.ts

import { BonusGenerateStatus } from '../models/hrm/employee/hrm_bonus_generate_model';

import type { Bonus } from '../models/hrm/employee/hrm_bonus_model';
import type { EmployeeList } from '../models/hrm/employee/hrm_employeeList_model';

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

  // Relations
  bonus?: Bonus;
  employee?: EmployeeList;
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
}

export type BonusGenerateUpdateAttributes = Partial<BonusGenerateCreationAttributes>;

// Helper type for including relations
export interface BonusGenerateWithRelations extends BonusGenerateAttributes {
  bonus?: Bonus;
  employee?: EmployeeList;
}
