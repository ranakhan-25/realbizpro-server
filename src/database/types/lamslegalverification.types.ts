// Auto-generated types for LamsLegalVerification
// Source: src/database/models/lams/legal-verification.model.ts

export interface LamsLegalVerificationAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  lead_id: string;
  lawyer_name?: string | null;
  title_clear: boolean;
  mutation_ok: boolean;
  tax_clear: boolean;
  status: string;
  verified_at?: Date | null;
  opinion?: string | null;
  report_url?: string | null;
  findings_json?: any | null;
  org_id: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export interface LamsLegalVerificationCreationAttributes {
  lead_id: string;
  lawyer_name?: string | null;
  title_clear?: boolean; // Has default value
  mutation_ok?: boolean; // Has default value
  tax_clear?: boolean; // Has default value
  status?: string; // Has default value
  verified_at?: Date | null;
  opinion?: string | null;
  report_url?: string | null;
  findings_json?: any | null;
  org_id: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type LamsLegalVerificationUpdateAttributes = Partial<LamsLegalVerificationCreationAttributes>;

// Helper type for including relations
export interface LamsLegalVerificationWithRelations extends LamsLegalVerificationAttributes {
  // No relations defined
}
