// Auto-generated types for HrmShift
// Source: src\database\models\hrm\employee\hrm_hrm_shift_model.ts

import { HrmShiftStatus } from '../models/hrm/employee/hrm_hrm_shift_model';

export interface HrmShiftAttributes {
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
  status: HrmShiftStatus;
}

export interface HrmShiftCreationAttributes {
  name: string;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  status?: HrmShiftStatus; // Has default value
}

export type HrmShiftUpdateAttributes = Partial<HrmShiftCreationAttributes>;

// Helper type for including relations
export interface HrmShiftWithRelations extends HrmShiftAttributes {
  // No relations defined
}
