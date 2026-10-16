// Auto-generated types for CrmRequirementType
// Source: src\database\models\crm\crm_requirement_type.model.ts

export interface CrmRequirementTypeAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  name: string;
  code?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;
}

export interface CrmRequirementTypeCreationAttributes {
  name: string;
  code?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;
}

export type CrmRequirementTypeUpdateAttributes = Partial<CrmRequirementTypeCreationAttributes>;

// Helper type for including relations
export interface CrmRequirementTypeWithRelations extends CrmRequirementTypeAttributes {
  // No relations defined
}
