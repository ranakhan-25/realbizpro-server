// Auto-generated types for InvSupplier
// Source: src/database/models/inventory/inv_supplier.model.ts

import type { InvPurchase } from '../models/inventory/inv_purchase.model';

export interface InvSupplierAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  code: string;
  name: string;
  company?: string | null;
  email?: string | null;
  mobile: string;
  address?: string | null;
  credit_limit: number;
  due_date?: Date | null;
  opening_balance: number;
  chart_of_group_id?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  org_id?: string | null;

  // Relations
  purchases?: InvPurchase[];
}

export interface InvSupplierCreationAttributes {
  code: string;
  name: string;
  company?: string | null;
  email?: string | null;
  mobile: string;
  address?: string | null;
  credit_limit?: number; // Has default value
  due_date?: Date | null;
  opening_balance?: number; // Has default value
  chart_of_group_id?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  org_id?: string | null;
}

export type InvSupplierUpdateAttributes = Partial<InvSupplierCreationAttributes>;

// Helper type for including relations
export interface InvSupplierWithRelations extends InvSupplierAttributes {
  purchases?: InvPurchase[];
}
