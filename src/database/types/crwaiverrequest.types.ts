// Auto-generated types for CrWaiverRequest
// Source: src/database/models/credit-realization/cr_waiver_request.model.ts

import type { CrSaleAgreement } from '../models/credit-realization/cr_sale_agreement.model';
import type { CrInstallmentPlan } from '../models/credit-realization/cr_installment_plan.model';

export interface CrWaiverRequestAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  org_id: string;
  sale_agreement_id: number;
  installment_plan_id: number;
  requested_amount: number;
  approved_amount: number;
  reason: string;
  attachment_url?: string | null;
  approver_id?: string | null;
  approver_name?: string | null;
  approval_status: string;
  approval_remarks?: string | null;
  actioned_at?: Date | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;

  // Relations
  sale_agreement: CrSaleAgreement;
  installment_plan: CrInstallmentPlan;
}

export interface CrWaiverRequestCreationAttributes {
  org_id: string;
  sale_agreement_id: number;
  installment_plan_id: number;
  requested_amount: number;
  approved_amount?: number; // Has default value
  reason: string;
  attachment_url?: string | null;
  approver_id?: string | null;
  approver_name?: string | null;
  approval_status?: string; // Has default value
  approval_remarks?: string | null;
  actioned_at?: Date | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type CrWaiverRequestUpdateAttributes = Partial<CrWaiverRequestCreationAttributes>;

// Helper type for including relations
export interface CrWaiverRequestWithRelations extends CrWaiverRequestAttributes {
  sale_agreement: CrSaleAgreement;
  installment_plan: CrInstallmentPlan;
}
