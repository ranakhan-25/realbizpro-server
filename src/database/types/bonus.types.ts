// Auto-generated types for Bonus
// Source: src\database\models\hrm\employee\hrm_bonus_model.ts

import { BonusStatus } from '../models/hrm/employee/hrm_bonus_model';

import type { BonusGenerate } from '../models/hrm/employee/hrm_bonus_generate_model';

export interface BonusAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  name: string;
  percentage: number;
  festivalDate: Date;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  status: BonusStatus;

  // Relations
  bonusGenerates?: BonusGenerate[];
}

export interface BonusCreationAttributes {
  name: string;
  percentage: number;
  festivalDate: Date;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  status?: BonusStatus; // Has default value
}

export type BonusUpdateAttributes = Partial<BonusCreationAttributes>;

// Helper type for including relations
export interface BonusWithRelations extends BonusAttributes {
  bonusGenerates?: BonusGenerate[];
}
