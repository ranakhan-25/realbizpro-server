// Auto-generated types for LamsDueDiligence
// Source: src/database/models/lams/due-diligence.model.ts

export interface LamsDueDiligenceAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  lead_id: string;
  score: number;
  status: string;
  surveyor_name?: string | null;
  report_url?: string | null;
  checklist_json?: any | null;
  org_id: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export interface LamsDueDiligenceCreationAttributes {
  lead_id: string;
  score?: number; // Has default value
  status?: string; // Has default value
  surveyor_name?: string | null;
  report_url?: string | null;
  checklist_json?: any | null;
  org_id: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type LamsDueDiligenceUpdateAttributes = Partial<LamsDueDiligenceCreationAttributes>;

// Helper type for including relations
export interface LamsDueDiligenceWithRelations extends LamsDueDiligenceAttributes {
  // No relations defined
}
