// Auto-generated types for HoldProperty
// Source: src/database/models/sales_management/sm_hold-property.model.ts

import { HoldStatus } from '../models/sales_management/sm_hold-property.model';

export interface HoldPropertyAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  propertyId: string;
  propertyName: string;
  propertyPrice: number;
  holdUntil: Date;
  reason: string;
  branch: string;
  buyerName?: string | null;
  buyerEmail?: string | null;
  buyerPhone?: string | null;
  tokenAmount?: number | null;
  reference?: string | null;
  notes?: string | null;
  status: HoldStatus;
  addedBy?: string | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export interface HoldPropertyCreationAttributes {
  propertyId: string;
  propertyName: string;
  propertyPrice: number;
  holdUntil: Date;
  reason: string;
  branch: string;
  buyerName?: string | null;
  buyerEmail?: string | null;
  buyerPhone?: string | null;
  tokenAmount?: number | null;
  reference?: string | null;
  notes?: string | null;
  status?: HoldStatus; // Has default value
  addedBy?: string | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type HoldPropertyUpdateAttributes = Partial<HoldPropertyCreationAttributes>;

// Helper type for including relations
export interface HoldPropertyWithRelations extends HoldPropertyAttributes {
  // No relations defined
}
