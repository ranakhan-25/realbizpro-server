// Auto-generated types for Bonus
// Source: src/database/models/hrm/employee/hrm_bonus_model.ts

import { BonusStatus } from '../models/hrm/employee/hrm_bonus_model';

import type { BonusGenerate } from '../models/hrm/employee/hrm_bonus_generate_model';
import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

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
  orgId?: number | null;
  projectId?: string | null;

  // Relations
  bonusGenerates?: BonusGenerate[];
  organization?: SysOrganization;
  project?: Project;
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
  orgId?: number | null;
  projectId?: string | null;
}

export type BonusUpdateAttributes = Partial<BonusCreationAttributes>;

// Helper type for including relations
export interface BonusWithRelations extends BonusAttributes {
  bonusGenerates?: BonusGenerate[];
  organization?: SysOrganization;
  project?: Project;
}
