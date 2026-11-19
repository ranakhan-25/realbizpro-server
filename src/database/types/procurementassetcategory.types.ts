// Auto-generated types for ProcurementAssetCategory
// Source: src/database/models/procurement/configuration/asset/pr_asset_category.model.ts

import type { ProcurementAssetItemEntry } from '../models/procurement/configuration/asset/pr_asset_item_entry.model';
import type { ProcurementAssetRfq } from '../models/procurement/rfq/pr_asset_rfq.model';
import type { ProcurementAssetPurchaseOrder } from '../models/procurement/purchase-order/pr_asset_purchase_order.model';
import type { ProcurementAssetRequisition } from '../models/procurement/requisition/pr_asset_requisition.model';
import type { ProcurementAssetGrn } from '../models/procurement/grn/pr_asset_grn.model';
import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface ProcurementAssetCategoryAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  type: string;
  code: string;
  name: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;

  // Relations
  items?: ProcurementAssetItemEntry[];
  rfqs?: ProcurementAssetRfq[];
  purchaseOrders?: ProcurementAssetPurchaseOrder[];
  requisitions?: ProcurementAssetRequisition[];
  grns?: ProcurementAssetGrn[];
  organization?: SysOrganization;
  project?: Project;
}

export interface ProcurementAssetCategoryCreationAttributes {
  type?: string; // Has default value
  code: string;
  name: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;
}

export type ProcurementAssetCategoryUpdateAttributes = Partial<ProcurementAssetCategoryCreationAttributes>;

// Helper type for including relations
export interface ProcurementAssetCategoryWithRelations extends ProcurementAssetCategoryAttributes {
  items?: ProcurementAssetItemEntry[];
  rfqs?: ProcurementAssetRfq[];
  purchaseOrders?: ProcurementAssetPurchaseOrder[];
  requisitions?: ProcurementAssetRequisition[];
  grns?: ProcurementAssetGrn[];
  organization?: SysOrganization;
  project?: Project;
}
