// Auto-generated types for InvStockIssue
// Source: src/database/models/inventory/stock-issue.model.ts

export interface InvStockIssueAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  issue_code?: string | null;
  warehouse_id?: number | null;
  item_id: string;
  quantity: number;
  issued_to?: string | null;
  ref_type?: string | null;
  ref_id?: string | null;
  photo_url?: string | null;
  date: Date;
  notes?: string | null;
  org_id: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export interface InvStockIssueCreationAttributes {
  issue_code?: string | null;
  warehouse_id?: number | null;
  item_id: string;
  quantity?: number; // Has default value
  issued_to?: string | null;
  ref_type?: string | null;
  ref_id?: string | null;
  photo_url?: string | null;
  date?: Date; // Has default value
  notes?: string | null;
  org_id: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type InvStockIssueUpdateAttributes = Partial<InvStockIssueCreationAttributes>;

// Helper type for including relations
export interface InvStockIssueWithRelations extends InvStockIssueAttributes {
  // No relations defined
}
