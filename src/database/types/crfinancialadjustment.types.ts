// Auto-generated types for CrFinancialAdjustment
// Source: src/database/models/credit-realization/cr_financial_adjustment.model.ts

import type { CrSaleAgreement } from '../models/credit-realization/cr_sale_agreement.model';
import type { CrInstallmentPlan } from '../models/credit-realization/cr_installment_plan.model';

export interface CrFinancialAdjustmentAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  org_id: string;
  sale_agreement_id: number;
  installment_plan_id?: number | null;
  adjustment_type: string;
  amount: number;
  reason: string;
  reference_no?: string | null;
  approved_by?: string | null;
  status: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;

  // Relations
  sale_agreement: CrSaleAgreement;
  installment_plan?: CrInstallmentPlan;
}

export interface CrFinancialAdjustmentCreationAttributes {
  org_id: string;
  sale_agreement_id: number;
  installment_plan_id?: number | null;
  adjustment_type: string;
  amount: number;
  reason: string;
  reference_no?: string | null;
  approved_by?: string | null;
  status?: string; // Has default value
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type CrFinancialAdjustmentUpdateAttributes = Partial<CrFinancialAdjustmentCreationAttributes>;

// Helper type for including relations
export interface CrFinancialAdjustmentWithRelations extends CrFinancialAdjustmentAttributes {
  sale_agreement: CrSaleAgreement;
  installment_plan?: CrInstallmentPlan;
}
