// Auto-generated types for CrInstallmentSetup
// Source: src\database\models\credit-realization\cr_installment_setup.model.ts

export interface CrInstallmentSetupAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  plan_code: string;
  plan_name: string;
  number_of_installments: number;
  frequency: string;
  penalty_rate_percentage: number;
  grace_period_days: number;
  description?: string | null;
  is_active: boolean;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  org_id?: string | null;
}

export interface CrInstallmentSetupCreationAttributes {
  plan_code: string;
  plan_name: string;
  number_of_installments: number;
  frequency?: string; // Has default value
  penalty_rate_percentage?: number; // Has default value
  grace_period_days?: number; // Has default value
  description?: string | null;
  is_active?: boolean; // Has default value
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  org_id?: string | null;
}

export type CrInstallmentSetupUpdateAttributes = Partial<CrInstallmentSetupCreationAttributes>;

// Helper type for including relations
export interface CrInstallmentSetupWithRelations extends CrInstallmentSetupAttributes {
  // No relations defined
}
