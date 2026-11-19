// Auto-generated types for LamsApproval
// Source: src/database/models/lams/approval.model.ts

export interface LamsApprovalAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  lead_id: string;
  level: string;
  approver_name?: string | null;
  decision: string;
  comment?: string | null;
  decided_at?: Date | null;
  stage: string;
  org_id: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export interface LamsApprovalCreationAttributes {
  lead_id: string;
  level?: string; // Has default value
  approver_name?: string | null;
  decision?: string; // Has default value
  comment?: string | null;
  decided_at?: Date | null;
  stage?: string; // Has default value
  org_id: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type LamsApprovalUpdateAttributes = Partial<LamsApprovalCreationAttributes>;

// Helper type for including relations
export interface LamsApprovalWithRelations extends LamsApprovalAttributes {
  // No relations defined
}
