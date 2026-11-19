// Auto-generated types for Installment
// Source: src/database/models/sales_management/sm_pay_installsment_model.ts

import type { InstallmentPlan } from '../models/sales_management/sm_pay_installsment_model';

export interface InstallmentAttributes {
  id: string;
  planId: string;
  no: number;
  amount: number;
  dueDate: string;
  status: string;
  paidDate?: string | null;
  method?: string | null;
  txn?: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  // Relations
  plan?: InstallmentPlan;
}

export interface InstallmentCreationAttributes {
  id?: string; // Auto increment
  planId: string;
  no: number;
  amount: number;
  dueDate: string;
  status?: string; // Has default value
  paidDate?: string | null;
  method?: string | null;
  txn?: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export type InstallmentUpdateAttributes = Partial<InstallmentCreationAttributes>;

// Helper type for including relations
export interface InstallmentWithRelations extends InstallmentAttributes {
  plan?: InstallmentPlan;
}
