// Auto-generated types for CrInstallmentPlan
// Source: src/database/models/credit-realization/cr_installment_plan.model.ts

import type { CrSaleAgreement } from '../models/credit-realization/cr_sale_agreement.model';
import type { CrInstallmentPayment } from '../models/credit-realization/cr_installment_payment.model';

export interface CrInstallmentPlanAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  sale_agreement_id: number;
  installment_no: number;
  title: string;
  due_date: string;
  payable_amount: number;
  paid_amount: number;
  due_amount: number;
  delay_days: number;
  penalty_amount: number;
  penalty_waived: number;
  status: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;

  // Relations
  sale_agreement: CrSaleAgreement;
  payments: CrInstallmentPayment[];
}

export interface CrInstallmentPlanCreationAttributes {
  sale_agreement_id: number;
  installment_no: number;
  title: string;
  due_date: string;
  payable_amount: number;
  paid_amount?: number; // Has default value
  due_amount: number;
  delay_days?: number; // Has default value
  penalty_amount?: number; // Has default value
  penalty_waived?: number; // Has default value
  status?: string; // Has default value
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;
}

export type CrInstallmentPlanUpdateAttributes = Partial<CrInstallmentPlanCreationAttributes>;

// Helper type for including relations
export interface CrInstallmentPlanWithRelations extends CrInstallmentPlanAttributes {
  sale_agreement: CrSaleAgreement;
  payments: CrInstallmentPayment[];
}
