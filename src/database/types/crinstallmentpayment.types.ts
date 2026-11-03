// Auto-generated types for CrInstallmentPayment
// Source: src\database\models\credit-realization\cr_installment_payment.model.ts

import type { CrInstallmentPlan } from '../models/credit-realization/cr_installment_plan.model';

export interface CrInstallmentPaymentAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  installment_plan_id: number;
  payment_voucher_no: string;
  paid_amount: number;
  penalty_paid: number;
  payment_date: string;
  payment_method: string;
  bank_name?: string | null;
  cheque_no?: string | null;
  cheque_date?: string | null;
  transaction_reference?: string | null;
  money_receipt_no?: string | null;
  status: string;
  remarks?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;

  // Relations
  installment_plan: CrInstallmentPlan;
}

export interface CrInstallmentPaymentCreationAttributes {
  installment_plan_id: number;
  payment_voucher_no: string;
  paid_amount: number;
  penalty_paid?: number; // Has default value
  payment_date: string;
  payment_method: string;
  bank_name?: string | null;
  cheque_no?: string | null;
  cheque_date?: string | null;
  transaction_reference?: string | null;
  money_receipt_no?: string | null;
  status?: string; // Has default value
  remarks?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;
}

export type CrInstallmentPaymentUpdateAttributes = Partial<CrInstallmentPaymentCreationAttributes>;

// Helper type for including relations
export interface CrInstallmentPaymentWithRelations extends CrInstallmentPaymentAttributes {
  installment_plan: CrInstallmentPlan;
}
