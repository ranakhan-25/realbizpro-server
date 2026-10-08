// Auto-generated types for projectType
// Source: src\database\models\projects\project\pr_project_types_model.ts

export interface projectTypeAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  code: string;
  name: string;
  createdBy?: number | null;
  updatedBy?: number | null;
  deletedBy?: number | null;
}

export interface projectTypeCreationAttributes {
  code: string;
  name: string;
  createdBy?: number | null;
  updatedBy?: number | null;
  deletedBy?: number | null;
}

export type projectTypeUpdateAttributes = Partial<projectTypeCreationAttributes>;

// Helper type for including relations
export interface projectTypeWithRelations extends projectTypeAttributes {
  // No relations defined
}
