// Auto-generated types for ProcurementAssetItemEntry
// Source: src/database/models/procurement/configuration/asset/pr_asset_item_entry.model.ts

import type { ProcurementAssetCategory } from '../models/procurement/configuration/asset/pr_asset_category.model';
import type { ProcurementUnit } from '../models/procurement/configuration/products/pr_unit.model';
import type { ProcurementBrand } from '../models/procurement/configuration/products/pr_brand.model';
import type { ProcurementAssetRfqItem } from '../models/procurement/rfq/pr_asset_rfq_item.model';
import type { ProcurementAssetPurchaseOrderItem } from '../models/procurement/purchase-order/pr_asset_purchase_order_item.model';
import type { ProcurementAssetRequisitionItem } from '../models/procurement/requisition/pr_asset_requisition_item.model';
import type { ProcurementAssetGrnItem } from '../models/procurement/grn/pr_asset_grn_item.model';
import type { ProcurementHireOrderItem } from '../models/procurement/equipment-hire/pr_hire_order_item.model';
import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface ProcurementAssetItemEntryAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  item_code: string;
  name: string;
  category_id: string;
  unit_id: string;
  brand_id?: string | null;
  purchase_price: number;
  chart_of_group_id?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;

  // Relations
  category?: ProcurementAssetCategory;
  unit?: ProcurementUnit;
  brand?: ProcurementBrand;
  rfqItems?: ProcurementAssetRfqItem[];
  purchaseOrderItems?: ProcurementAssetPurchaseOrderItem[];
  requisitionItems?: ProcurementAssetRequisitionItem[];
  grnItems?: ProcurementAssetGrnItem[];
  hireOrderItems?: ProcurementHireOrderItem[];
  organization?: SysOrganization;
  project?: Project;
}

export interface ProcurementAssetItemEntryCreationAttributes {
  item_code: string;
  name: string;
  category_id: string;
  unit_id: string;
  brand_id?: string | null;
  purchase_price?: number; // Has default value
  chart_of_group_id?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;
}

export type ProcurementAssetItemEntryUpdateAttributes = Partial<ProcurementAssetItemEntryCreationAttributes>;

// Helper type for including relations
export interface ProcurementAssetItemEntryWithRelations extends ProcurementAssetItemEntryAttributes {
  category?: ProcurementAssetCategory;
  unit?: ProcurementUnit;
  brand?: ProcurementBrand;
  rfqItems?: ProcurementAssetRfqItem[];
  purchaseOrderItems?: ProcurementAssetPurchaseOrderItem[];
  requisitionItems?: ProcurementAssetRequisitionItem[];
  grnItems?: ProcurementAssetGrnItem[];
  hireOrderItems?: ProcurementHireOrderItem[];
  organization?: SysOrganization;
  project?: Project;
}
