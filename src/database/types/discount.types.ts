// Auto-generated types for Discount
// Source: src/database/models/sales_management/sm_discount.model.ts

import { DiscountType } from '../models/sales_management/sm_discount.model';

export interface DiscountAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  propertyId: string;
  propertyName: string;
  discountType: DiscountType;
  discountValue: number;
  reason: string;
  audience?: string | null;
  maxUses?: number | null;
  minPurchase?: number | null;
  startDate: Date;
  endDate: Date;
  couponCode?: string | null;
  notes?: string | null;
  addedBy?: string | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export interface DiscountCreationAttributes {
  propertyId: string;
  propertyName: string;
  discountType?: DiscountType; // Has default value
  discountValue?: number; // Has default value
  reason: string;
  audience?: string | null;
  maxUses?: number | null;
  minPurchase?: number | null;
  startDate: Date;
  endDate: Date;
  couponCode?: string | null;
  notes?: string | null;
  addedBy?: string | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type DiscountUpdateAttributes = Partial<DiscountCreationAttributes>;

// Helper type for including relations
export interface DiscountWithRelations extends DiscountAttributes {
  // No relations defined
}
