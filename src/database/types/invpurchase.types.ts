// Auto-generated types for InvPurchase
// Source: src/database/models/inventory/inv_purchase.model.ts

import type { InvSupplier } from '../models/inventory/inv_supplier.model';
import type { InvPurchaseItem } from '../models/inventory/inv_purchase_item.model';

export interface InvPurchaseAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  date: Date;
  payment_method?: string | null;
  subtotal: number;
  discount: number;
  delivery_charge: number;
  grand_total: number;
  paid_amount: number;
  due_amount: number;
  cheque_no?: string | null;
  cheque_date?: Date | null;
  supplier_id: string;
  project_type_id?: string | null;
  project_id?: string | null;
  org_id: string;
  boq_title_id?: string | null;
  task_id?: string | null;
  site_id?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;

  // Relations
  supplier?: InvSupplier;
  items?: InvPurchaseItem[];
}

export interface InvPurchaseCreationAttributes {
  date: Date;
  payment_method?: string | null;
  subtotal?: number; // Has default value
  discount?: number; // Has default value
  delivery_charge?: number; // Has default value
  grand_total?: number; // Has default value
  paid_amount?: number; // Has default value
  due_amount?: number; // Has default value
  cheque_no?: string | null;
  cheque_date?: Date | null;
  supplier_id: string;
  project_type_id?: string | null;
  project_id?: string | null;
  org_id: string;
  boq_title_id?: string | null;
  task_id?: string | null;
  site_id?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type InvPurchaseUpdateAttributes = Partial<InvPurchaseCreationAttributes>;

// Helper type for including relations
export interface InvPurchaseWithRelations extends InvPurchaseAttributes {
  supplier?: InvSupplier;
  items?: InvPurchaseItem[];
}
