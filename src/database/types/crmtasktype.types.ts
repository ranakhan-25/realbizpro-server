// Auto-generated types for CrmTaskType
// Source: src/database/models/crm/crm_task_type.model.ts

export interface CrmTaskTypeAttributes {
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

export interface CrmTaskTypeCreationAttributes {
  name: string;
  code?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;
}

export type CrmTaskTypeUpdateAttributes = Partial<CrmTaskTypeCreationAttributes>;

// Helper type for including relations
export interface CrmTaskTypeWithRelations extends CrmTaskTypeAttributes {
  // No relations defined
}
