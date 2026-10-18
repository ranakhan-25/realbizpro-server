// Auto-generated types for CrmVisitPlace
// Source: src\database\models\crm\crm_visit_place.model.ts

export interface CrmVisitPlaceAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  name: string;
  address?: string | null;
  contact_person?: string | null;
  contact_number?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;
}

export interface CrmVisitPlaceCreationAttributes {
  name: string;
  address?: string | null;
  contact_person?: string | null;
  contact_number?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;
}

export type CrmVisitPlaceUpdateAttributes = Partial<CrmVisitPlaceCreationAttributes>;

// Helper type for including relations
export interface CrmVisitPlaceWithRelations extends CrmVisitPlaceAttributes {
  // No relations defined
}
