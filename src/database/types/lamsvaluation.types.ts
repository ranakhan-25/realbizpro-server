// Auto-generated types for LamsValuation
// Source: src/database/models/lams/valuation.model.ts

export interface LamsValuationAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  lead_id: string;
  valuer_id?: string | null;
  market_rate: number;
  govt_rate: number;
  total_value: number;
  method: string;
  report_url?: string | null;
  valued_at: Date;
  status: string;
  notes?: string | null;
  org_id: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export interface LamsValuationCreationAttributes {
  lead_id: string;
  valuer_id?: string | null;
  market_rate?: number; // Has default value
  govt_rate?: number; // Has default value
  total_value?: number; // Has default value
  method?: string; // Has default value
  report_url?: string | null;
  valued_at?: Date; // Has default value
  status?: string; // Has default value
  notes?: string | null;
  org_id: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type LamsValuationUpdateAttributes = Partial<LamsValuationCreationAttributes>;

// Helper type for including relations
export interface LamsValuationWithRelations extends LamsValuationAttributes {
  // No relations defined
}
