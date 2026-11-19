// Auto-generated types for InstallmentPlan
// Source: src/database/models/sales_management/sm_pay_installsment_model.ts

import type { Installment } from '../models/sales_management/sm_pay_installsment_model';

export interface InstallmentPlanAttributes {
  id: string;
  planCode: string;
  propertyId: string;
  buyerId: string;
  totalPrice: number;
  downPayment: number;
  financed: number;
  interestRate: number;
  totalInstallments: number;
  monthlyAmount: number;
  startDate: string;
  endDate: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  // Relations
  installments: Installment[];
}

export interface InstallmentPlanCreationAttributes {
  id?: string; // Auto increment
  planCode: string;
  propertyId: string;
  buyerId: string;
  totalPrice: number;
  downPayment: number;
  financed: number;
  interestRate: number;
  totalInstallments: number;
  monthlyAmount: number;
  startDate: string;
  endDate: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export type InstallmentPlanUpdateAttributes = Partial<InstallmentPlanCreationAttributes>;

// Helper type for including relations
export interface InstallmentPlanWithRelations extends InstallmentPlanAttributes {
  installments: Installment[];
}
