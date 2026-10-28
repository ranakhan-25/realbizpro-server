// Auto-generated types for CrSaleAgreement
// Source: src\database\models\credit-realization\cr_sale_agreement.model.ts

import type { CrInstallmentPlan } from '../models/credit-realization/cr_installment_plan.model';
import type { CrPlotDistribution } from '../models/credit-realization/cr_plot_distribution.model';
import type { CrRecoveryLog } from '../models/credit-realization/cr_recovery_log.model';

export interface CrSaleAgreementAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  agreement_number: string;
  customer_id: string;
  customer_name: string;
  customer_phone?: string | null;
  property_type: string;
  unit_identifier: string;
  total_price: number;
  down_payment: number;
  booking_money: number;
  agreement_date: string;
  handover_date?: string | null;
  status: string;
  terms_and_conditions?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;

  // Relations
  installment_plans: CrInstallmentPlan[];
  plot_distributions: CrPlotDistribution[];
  recovery_logs: CrRecoveryLog[];
}

export interface CrSaleAgreementCreationAttributes {
  agreement_number: string;
  customer_id: string;
  customer_name: string;
  customer_phone?: string | null;
  property_type: string;
  unit_identifier: string;
  total_price: number;
  down_payment?: number; // Has default value
  booking_money?: number; // Has default value
  agreement_date: string;
  handover_date?: string | null;
  status?: string; // Has default value
  terms_and_conditions?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;
}

export type CrSaleAgreementUpdateAttributes = Partial<CrSaleAgreementCreationAttributes>;

// Helper type for including relations
export interface CrSaleAgreementWithRelations extends CrSaleAgreementAttributes {
  installment_plans: CrInstallmentPlan[];
  plot_distributions: CrPlotDistribution[];
  recovery_logs: CrRecoveryLog[];
}
