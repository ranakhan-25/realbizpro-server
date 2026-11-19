// Auto-generated types for LamsSettlement
// Source: src/database/models/lams/settlement.model.ts

export interface LamsSettlementAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  org_id: string;
  lead_id: string;
  owner_id?: string | null;
  agreed_amount: number;
  advance_amount: number;
  paid_amount: number;
  due_amount: number;
  payment_mode: string;
  scheduled_at?: Date | null;
  status: string;
  payment_schedule?: any | null;
  notes?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export interface LamsSettlementCreationAttributes {
  org_id: string;
  lead_id: string;
  owner_id?: string | null;
  agreed_amount?: number; // Has default value
  advance_amount?: number; // Has default value
  paid_amount?: number; // Has default value
  due_amount?: number; // Has default value
  payment_mode?: string; // Has default value
  scheduled_at?: Date | null;
  status?: string; // Has default value
  payment_schedule?: any | null;
  notes?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type LamsSettlementUpdateAttributes = Partial<LamsSettlementCreationAttributes>;

// Helper type for including relations
export interface LamsSettlementWithRelations extends LamsSettlementAttributes {
  // No relations defined
}
