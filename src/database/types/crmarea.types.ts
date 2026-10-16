// Auto-generated types for CrmArea
// Source: src/database/models/crm/crm_area.model.ts

export interface CrmAreaAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  name: string;
  city?: string | null;
  zone?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;
}

export interface CrmAreaCreationAttributes {
  name: string;
  city?: string | null;
  zone?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;
}

export type CrmAreaUpdateAttributes = Partial<CrmAreaCreationAttributes>;

// Helper type for including relations
export interface CrmAreaWithRelations extends CrmAreaAttributes {
  // No relations defined
}
