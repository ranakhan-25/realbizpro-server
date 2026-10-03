// Auto-generated types for projectType
// Source: src\database\models\projects\pr_project_types_model.ts

export interface projectTypeAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  code: string;
  name: string;
}

export interface projectTypeCreationAttributes {
  code: string;
  name: string;
}

export type projectTypeUpdateAttributes = Partial<projectTypeCreationAttributes>;

// Helper type for including relations
export interface projectTypeWithRelations extends projectTypeAttributes {
  // No relations defined
}
