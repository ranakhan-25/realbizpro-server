// Auto-generated types for SalaryGrade
// Source: src/database/models/hrm/employee/hrm_salary_grade_model.ts

import { SalaryGradeStatus } from '../models/hrm/employee/hrm_salary_grade_model';

export interface SalaryGradeAttributes {
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
  status: SalaryGradeStatus;
}

export interface SalaryGradeCreationAttributes {
  name: string;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  status?: SalaryGradeStatus; // Has default value
}

export type SalaryGradeUpdateAttributes = Partial<SalaryGradeCreationAttributes>;

// Helper type for including relations
export interface SalaryGradeWithRelations extends SalaryGradeAttributes {
  // No relations defined
}
