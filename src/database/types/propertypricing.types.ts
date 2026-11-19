// Auto-generated types for PropertyPricing
// Source: src/database/models/sales_management/sm_pricing_form_model.ts

export interface PropertyPricingAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  propertyId: string;
  propertyName: string;
  basePrice: number;
  retailPrice: number;
  investorPrice: number;
  vipPrice: number;
  taxPercent: number;
  discountPercent: number;
  bookingFee: number;
  effectiveDate?: Date | null;
  notes?: string | null;
  addedBy?: string | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export interface PropertyPricingCreationAttributes {
  propertyId: string;
  propertyName: string;
  basePrice?: number; // Has default value
  retailPrice?: number; // Has default value
  investorPrice?: number; // Has default value
  vipPrice?: number; // Has default value
  taxPercent?: number; // Has default value
  discountPercent?: number; // Has default value
  bookingFee?: number; // Has default value
  effectiveDate?: Date | null;
  notes?: string | null;
  addedBy?: string | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type PropertyPricingUpdateAttributes = Partial<PropertyPricingCreationAttributes>;

// Helper type for including relations
export interface PropertyPricingWithRelations extends PropertyPricingAttributes {
  // No relations defined
}
