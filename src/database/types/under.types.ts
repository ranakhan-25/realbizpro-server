// Auto-generated types for Under
// Source: src/database/models/hrm/employee/hrm_under_model.ts

import { UnderStatus } from '../models/hrm/employee/hrm_under_model';

export interface UnderAttributes {
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
  status: UnderStatus;
}

export interface UnderCreationAttributes {
  name: string;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  status?: UnderStatus; // Has default value
}

export type UnderUpdateAttributes = Partial<UnderCreationAttributes>;

// Helper type for including relations
export interface UnderWithRelations extends UnderAttributes {
  // No relations defined
}
