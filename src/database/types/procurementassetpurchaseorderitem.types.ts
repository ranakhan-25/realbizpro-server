// Auto-generated types for ProcurementAssetPurchaseOrderItem
// Source: src/database/models/procurement/purchase-order/pr_asset_purchase_order_item.model.ts

import type { ProcurementAssetPurchaseOrder } from '../models/procurement/purchase-order/pr_asset_purchase_order.model';
import type { ProcurementAssetItemEntry } from '../models/procurement/configuration/asset/pr_asset_item_entry.model';
import type { ProcurementUnit } from '../models/procurement/configuration/products/pr_unit.model';
import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface ProcurementAssetPurchaseOrderItemAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  purchase_order_id: string;
  item_id: string;
  unit_id: string;
  item_code: string;
  item_name: string;
  details?: string | null;
  unit?: string | null;
  quantity: number;
  rate: number;
  amount: number;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;

  // Relations
  purchaseOrder?: ProcurementAssetPurchaseOrder;
  item?: ProcurementAssetItemEntry;
  unitRelation?: ProcurementUnit;
  organization?: SysOrganization;
  project?: Project;
}

export interface ProcurementAssetPurchaseOrderItemCreationAttributes {
  purchase_order_id: string;
  item_id: string;
  unit_id: string;
  item_code: string;
  item_name: string;
  details?: string | null;
  unit?: string | null;
  quantity?: number; // Has default value
  rate?: number; // Has default value
  amount?: number; // Has default value
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;
}

export type ProcurementAssetPurchaseOrderItemUpdateAttributes = Partial<ProcurementAssetPurchaseOrderItemCreationAttributes>;

// Helper type for including relations
export interface ProcurementAssetPurchaseOrderItemWithRelations extends ProcurementAssetPurchaseOrderItemAttributes {
  purchaseOrder?: ProcurementAssetPurchaseOrder;
  item?: ProcurementAssetItemEntry;
  unitRelation?: ProcurementUnit;
  organization?: SysOrganization;
  project?: Project;
}
