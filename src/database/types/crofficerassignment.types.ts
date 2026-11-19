// Auto-generated types for CrOfficerAssignment
// Source: src/database/models/credit-realization/cr_officer_assignment.model.ts

import type { CrSaleAgreement } from '../models/credit-realization/cr_sale_agreement.model';

export interface CrOfficerAssignmentAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  org_id: string;
  officer_id: string;
  officer_name: string;
  sale_agreement_id: number;
  target_amount: number;
  collected_amount: number;
  due_date: string;
  assignment_date: string;
  status: string;
  notes?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;

  // Relations
  sale_agreement: CrSaleAgreement;
}

export interface CrOfficerAssignmentCreationAttributes {
  org_id: string;
  officer_id: string;
  officer_name: string;
  sale_agreement_id: number;
  target_amount?: number; // Has default value
  collected_amount?: number; // Has default value
  due_date: string;
  assignment_date?: string; // Has default value
  status?: string; // Has default value
  notes?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type CrOfficerAssignmentUpdateAttributes = Partial<CrOfficerAssignmentCreationAttributes>;

// Helper type for including relations
export interface CrOfficerAssignmentWithRelations extends CrOfficerAssignmentAttributes {
  sale_agreement: CrSaleAgreement;
}
