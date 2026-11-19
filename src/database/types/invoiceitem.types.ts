// Auto-generated types for InvoiceItem
// Source: src/database/models/projects/billing/pr_invoice_item.model.ts

import type { Invoice } from '../models/projects/billing/pr_invoice.model';
import type { Item } from '../models/projects/billing/pr_item.model';
import type { SysOrganization } from '../models/system/sys_organization.model';

export interface InvoiceItemAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  invoiceId: string;
  itemId?: string | null;
  itemName: string;
  description?: string | null;
  unit: string;
  quantity: number;
  rate: number;
  amount: number;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;

  // Relations
  invoice?: Invoice;
  item?: Item;
  organization?: SysOrganization;
}

export interface InvoiceItemCreationAttributes {
  invoiceId: string;
  itemId?: string | null;
  itemName: string;
  description?: string | null;
  unit?: string; // Has default value
  quantity?: number; // Has default value
  rate?: number; // Has default value
  amount?: number; // Has default value
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
}

export type InvoiceItemUpdateAttributes = Partial<InvoiceItemCreationAttributes>;

// Helper type for including relations
export interface InvoiceItemWithRelations extends InvoiceItemAttributes {
  invoice?: Invoice;
  item?: Item;
  organization?: SysOrganization;
}
