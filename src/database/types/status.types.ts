// Auto-generated types for Status
// Source: src\database\models\status.model.ts

export interface StatusAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  name: string;
  description?: string | null;
}

export interface StatusCreationAttributes {
  name: string;
  description?: string | null;
}

export type StatusUpdateAttributes = Partial<StatusCreationAttributes>;

// Helper type for including relations
export interface StatusWithRelations extends StatusAttributes {
  // No relations defined
}
