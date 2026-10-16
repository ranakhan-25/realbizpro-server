// Auto-generated types for Section
// Source: src/database/models/hrm/employee/hrm_section_model.ts

import { SectionStatus } from '../models/hrm/employee/hrm_section_model';

import type { EmployeeList } from '../models/hrm/employee/hrm_employeeList_model';

export interface SectionAttributes {
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
  status: SectionStatus;

  // Relations
  employees?: EmployeeList[];
}

export interface SectionCreationAttributes {
  name: string;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  status?: SectionStatus; // Has default value
}

export type SectionUpdateAttributes = Partial<SectionCreationAttributes>;

// Helper type for including relations
export interface SectionWithRelations extends SectionAttributes {
  employees?: EmployeeList[];
}
