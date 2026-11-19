// Auto-generated types for PayCommission
// Source: src/database/models/sales_management/sm_pay_commission.model.ts

import { PaymentMethod } from '../models/sales_management/sm_pay_commission.model';

export interface PayCommissionAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  agentId: string;
  agentName: string;
  agentRole?: string | null;
  agentAvatar?: string | null;
  bankName?: string | null;
  accountNo?: string | null;
  branch?: string | null;
  paymentMethod: PaymentMethod;
  totalAmount: number;
  dealIds?: string | null;
  dealBreakdown?: string | null;
  notes?: string | null;
  acknowledged: boolean;
  status?: string | null;
  addedBy?: string | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export interface PayCommissionCreationAttributes {
  agentId: string;
  agentName: string;
  agentRole?: string | null;
  agentAvatar?: string | null;
  bankName?: string | null;
  accountNo?: string | null;
  branch?: string | null;
  paymentMethod?: PaymentMethod; // Has default value
  totalAmount?: number; // Has default value
  dealIds?: string | null;
  dealBreakdown?: string | null;
  notes?: string | null;
  acknowledged?: boolean; // Has default value
  status?: string | null;
  addedBy?: string | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type PayCommissionUpdateAttributes = Partial<PayCommissionCreationAttributes>;

// Helper type for including relations
export interface PayCommissionWithRelations extends PayCommissionAttributes {
  // No relations defined
}
