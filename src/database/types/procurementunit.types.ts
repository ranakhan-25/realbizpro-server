// Auto-generated types for ProcurementUnit
// Source: src/database/models/procurement/configuration/products/pr_unit.model.ts

import type { ProcurementItemEntry } from '../models/procurement/configuration/products/pr_item_entry.model';
import type { ProcurementAssetItemEntry } from '../models/procurement/configuration/asset/pr_asset_item_entry.model';
import type { ProcurementGrnItem } from '../models/procurement/grn/pr_grn_item.model';
import type { ProcurementRfqItem } from '../models/procurement/rfq/pr_rfq_item.model';
import type { ProcurementPurchaseOrderItem } from '../models/procurement/purchase-order/pr_purchase_order_item.model';
import type { ProcurementMaterialRequisitionItem } from '../models/procurement/requisition/pr_material_requisition_item.model';
import type { ProcurementAssetRfqItem } from '../models/procurement/rfq/pr_asset_rfq_item.model';
import type { ProcurementAssetPurchaseOrderItem } from '../models/procurement/purchase-order/pr_asset_purchase_order_item.model';
import type { ProcurementAssetRequisitionItem } from '../models/procurement/requisition/pr_asset_requisition_item.model';
import type { ProcurementAssetGrnItem } from '../models/procurement/grn/pr_asset_grn_item.model';
import type { ProcurementBoqItem } from '../models/procurement/boq/pr_procurement_boq_item.model';
import type { ProcurementHireOrderItem } from '../models/procurement/equipment-hire/pr_hire_order_item.model';
import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface ProcurementUnitAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  code: string;
  name: string;
  conversionUnit?: string | null;
  rate?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;

  // Relations
  itemEntries?: ProcurementItemEntry[];
  assetItems?: ProcurementAssetItemEntry[];
  grnItems?: ProcurementGrnItem[];
  rfqItems?: ProcurementRfqItem[];
  purchaseOrderItems?: ProcurementPurchaseOrderItem[];
  requisitionItems?: ProcurementMaterialRequisitionItem[];
  assetRfqItems?: ProcurementAssetRfqItem[];
  assetPurchaseOrderItems?: ProcurementAssetPurchaseOrderItem[];
  assetRequisitionItems?: ProcurementAssetRequisitionItem[];
  assetGrnItems?: ProcurementAssetGrnItem[];
  procurementBoqItems?: ProcurementBoqItem[];
  hireOrderItems?: ProcurementHireOrderItem[];
  organization?: SysOrganization;
  project?: Project;
}

export interface ProcurementUnitCreationAttributes {
  code: string;
  name: string;
  conversionUnit?: string | null;
  rate?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;
}

export type ProcurementUnitUpdateAttributes = Partial<ProcurementUnitCreationAttributes>;

// Helper type for including relations
export interface ProcurementUnitWithRelations extends ProcurementUnitAttributes {
  itemEntries?: ProcurementItemEntry[];
  assetItems?: ProcurementAssetItemEntry[];
  grnItems?: ProcurementGrnItem[];
  rfqItems?: ProcurementRfqItem[];
  purchaseOrderItems?: ProcurementPurchaseOrderItem[];
  requisitionItems?: ProcurementMaterialRequisitionItem[];
  assetRfqItems?: ProcurementAssetRfqItem[];
  assetPurchaseOrderItems?: ProcurementAssetPurchaseOrderItem[];
  assetRequisitionItems?: ProcurementAssetRequisitionItem[];
  assetGrnItems?: ProcurementAssetGrnItem[];
  procurementBoqItems?: ProcurementBoqItem[];
  hireOrderItems?: ProcurementHireOrderItem[];
  organization?: SysOrganization;
  project?: Project;
}
