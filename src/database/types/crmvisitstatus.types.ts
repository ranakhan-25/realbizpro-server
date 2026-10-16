// Auto-generated types for CrmVisitStatus
// Source: src/database/models/crm/crm_visit_status.model.ts

export interface CrmVisitStatusAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  name: string;
  color?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;
}

export interface CrmVisitStatusCreationAttributes {
  name: string;
  color?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;
}

export type CrmVisitStatusUpdateAttributes = Partial<CrmVisitStatusCreationAttributes>;

// Helper type for including relations
export interface CrmVisitStatusWithRelations extends CrmVisitStatusAttributes {
  // No relations defined
}
