// Auto-generated types for CrmFeature
// Source: src/database/models/crm/crm_feature.model.ts

export interface CrmFeatureAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  name: string;
  code?: string | null;
  description?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;
}

export interface CrmFeatureCreationAttributes {
  name: string;
  code?: string | null;
  description?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;
}

export type CrmFeatureUpdateAttributes = Partial<CrmFeatureCreationAttributes>;

// Helper type for including relations
export interface CrmFeatureWithRelations extends CrmFeatureAttributes {
  // No relations defined
}
