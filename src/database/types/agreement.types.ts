// Auto-generated types for Agreement
// Source: src/database/models/sales_management/sm_agreement_view.model.ts

import { PropertyType } from '../models/sales_management/sm_agreement_view.model';
import { AgreementStatus } from '../models/sales_management/sm_agreement_view.model';

export interface AgreementAttributes {
  id: string;
  agreementCode: string;
  buyer: string;
  buyerAvatar: string | null;
  property: string;
  propertyCode: string;
  propertyType: PropertyType;
  price: number;
  advance: number;
  date: string;
  status: AgreementStatus;
  image: string | null;
  buyerEmail: string | null;
  buyerPhone: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface AgreementCreationAttributes {
  id?: string; // Auto increment
  agreementCode: string;
  buyer: string;
  buyerAvatar?: string | null; // Nullable
  property: string;
  propertyCode: string;
  propertyType: PropertyType;
  price: number;
  advance: number;
  date: string;
  status: AgreementStatus;
  image?: string | null; // Nullable
  buyerEmail?: string | null; // Nullable
  buyerPhone?: string | null; // Nullable
  notes?: string | null; // Nullable
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export type AgreementUpdateAttributes = Partial<AgreementCreationAttributes>;

// Helper type for including relations
export interface AgreementWithRelations extends AgreementAttributes {
  // No relations defined
}
