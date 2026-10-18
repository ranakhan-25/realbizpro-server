// Auto-generated types for CrmPriceRange
// Source: src\database\models\crm\crm_price_range.model.ts

export interface CrmPriceRangeAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  name: string;
  min_price?: number | null;
  max_price?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;
}

export interface CrmPriceRangeCreationAttributes {
  name: string;
  min_price?: number | null;
  max_price?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  projectId?: string | null;
}

export type CrmPriceRangeUpdateAttributes = Partial<CrmPriceRangeCreationAttributes>;

// Helper type for including relations
export interface CrmPriceRangeWithRelations extends CrmPriceRangeAttributes {
  // No relations defined
}
