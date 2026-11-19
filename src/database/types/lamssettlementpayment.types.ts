// Auto-generated types for LamsSettlementPayment
// Source: src/database/models/lams/settlement-payment.model.ts

export interface LamsSettlementPaymentAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  org_id: string;
  settlement_id: string;
  lead_id: string;
  payment_no: string;
  installment_no: number;
  amount: number;
  payment_date: Date;
  payment_method: string;
  reference_no?: string | null;
  status: string;
  remarks?: string | null;
  receipt_url?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export interface LamsSettlementPaymentCreationAttributes {
  org_id: string;
  settlement_id: string;
  lead_id: string;
  payment_no: string;
  installment_no?: number; // Has default value
  amount?: number; // Has default value
  payment_date?: Date; // Has default value
  payment_method?: string; // Has default value
  reference_no?: string | null;
  status?: string; // Has default value
  remarks?: string | null;
  receipt_url?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type LamsSettlementPaymentUpdateAttributes = Partial<LamsSettlementPaymentCreationAttributes>;

// Helper type for including relations
export interface LamsSettlementPaymentWithRelations extends LamsSettlementPaymentAttributes {
  // No relations defined
}
