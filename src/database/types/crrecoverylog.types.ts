// Auto-generated types for CrRecoveryLog
// Source: src/database/models/credit-realization/cr_recovery_log.model.ts

import type { CrSaleAgreement } from '../models/credit-realization/cr_sale_agreement.model';

export interface CrRecoveryLogAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  sale_agreement_id: number;
  customer_id?: string | null;
  action_type: string;
  action_date: Date;
  promised_payment_date?: string | null;
  promised_amount?: number | null;
  officer_name: string;
  customer_response?: string | null;
  outcome: string;
  next_action_date?: string | null;
  geo_location?: string | null;
  visit_photos?: string | null;
  visit_outcome?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  org_id?: string | null;

  // Relations
  sale_agreement: CrSaleAgreement;
}

export interface CrRecoveryLogCreationAttributes {
  sale_agreement_id: number;
  customer_id?: string | null;
  action_type: string;
  action_date: Date;
  promised_payment_date?: string | null;
  promised_amount?: number | null;
  officer_name: string;
  customer_response?: string | null;
  outcome?: string; // Has default value
  next_action_date?: string | null;
  geo_location?: string | null;
  visit_photos?: string | null;
  visit_outcome?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  org_id?: string | null;
}

export type CrRecoveryLogUpdateAttributes = Partial<CrRecoveryLogCreationAttributes>;

// Helper type for including relations
export interface CrRecoveryLogWithRelations extends CrRecoveryLogAttributes {
  sale_agreement: CrSaleAgreement;
}
