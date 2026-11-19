// Auto-generated types for ProcurementPurchaseOrderItem
// Source: src/database/models/procurement/purchase-order/pr_purchase_order_item.model.ts

import type { ProcurementPurchaseOrder } from '../models/procurement/purchase-order/pr_purchase_order.model';
import type { ProcurementItemEntry } from '../models/procurement/configuration/products/pr_item_entry.model';
import type { ProcurementUnit } from '../models/procurement/configuration/products/pr_unit.model';
import type { ProcurementGrnItem } from '../models/procurement/grn/pr_grn_item.model';
import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface ProcurementPurchaseOrderItemAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  purchase_order_id: string;
  item_id?: string | null;
  unit_id?: string | null;
  item_code: string;
  item_name: string;
  details?: string | null;
  unit?: string | null;
  quantity: number;
  rate: number;
  budget_qty: number;
  purchase_qty: number;
  stock_qty: number;
  amount: number;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;

  // Relations
  purchaseOrder?: ProcurementPurchaseOrder;
  item?: ProcurementItemEntry;
  unitRelation?: ProcurementUnit;
  grnItems?: ProcurementGrnItem[];
  organization?: SysOrganization;
  project?: Project;
}

export interface ProcurementPurchaseOrderItemCreationAttributes {
  purchase_order_id: string;
  item_id?: string | null;
  unit_id?: string | null;
  item_code: string;
  item_name: string;
  details?: string | null;
  unit?: string | null;
  quantity?: number; // Has default value
  rate?: number; // Has default value
  budget_qty?: number; // Has default value
  purchase_qty?: number; // Has default value
  stock_qty?: number; // Has default value
  amount?: number; // Has default value
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;
}

export type ProcurementPurchaseOrderItemUpdateAttributes = Partial<ProcurementPurchaseOrderItemCreationAttributes>;

// Helper type for including relations
export interface ProcurementPurchaseOrderItemWithRelations extends ProcurementPurchaseOrderItemAttributes {
  purchaseOrder?: ProcurementPurchaseOrder;
  item?: ProcurementItemEntry;
  unitRelation?: ProcurementUnit;
  grnItems?: ProcurementGrnItem[];
  organization?: SysOrganization;
  project?: Project;
}
