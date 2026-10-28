// Auto-generated types for BillingCategory
// Source: src\database\models\projects\billing\pr_category.model.ts

import { CategoryType } from '../models/projects/billing/pr_category.model';

import type { MaterialRequisition } from '../models/projects/material-requisition/pr_material_requisition.model';
import type { BillingSubCategory } from '../models/projects/billing/pr_sub_category.model';
import type { Quotation } from '../models/projects/quatation/pr_quotation.model';
import type { WorkOrder } from '../models/projects/billing/work-order/pr_work_order.model';
import type { ProcurementRfq } from '../models/procurement/rfq/pr_rfq.model';
import type { ProcurementAssetRfq } from '../models/procurement/rfq/pr_asset_rfq.model';
import type { ProcurementMaterialRequisition } from '../models/procurement/requisition/pr_material_requisition.model';
import type { ProcurementAssetRequisition } from '../models/procurement/requisition/pr_asset_requisition.model';
import type { ProcurementPurchaseOrder } from '../models/procurement/purchase-order/pr_purchase_order.model';
import type { ProcurementAssetPurchaseOrder } from '../models/procurement/purchase-order/pr_asset_purchase_order.model';
import type { ProcurementGrn } from '../models/procurement/grn/pr_grn.model';
import type { ProcurementAssetGrn } from '../models/procurement/grn/pr_asset_grn.model';

export interface BillingCategoryAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  type: CategoryType;
  code: string;
  name: string;
  description?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;

  // Relations
  materialRequisitions?: MaterialRequisition[];
  subCategories?: BillingSubCategory[];
  quotations?: Quotation[];
  workOrders?: WorkOrder[];
  procurementRfqs?: ProcurementRfq[];
  procurementAssetRfqs?: ProcurementAssetRfq[];
  procurementMaterialRequisitions?: ProcurementMaterialRequisition[];
  procurementAssetRequisitions?: ProcurementAssetRequisition[];
  procurementPurchaseOrders?: ProcurementPurchaseOrder[];
  procurementAssetPurchaseOrders?: ProcurementAssetPurchaseOrder[];
  procurementGrns?: ProcurementGrn[];
  procurementAssetGrns?: ProcurementAssetGrn[];
}

export interface BillingCategoryCreationAttributes {
  type: CategoryType;
  code: string;
  name: string;
  description?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type BillingCategoryUpdateAttributes = Partial<BillingCategoryCreationAttributes>;

// Helper type for including relations
export interface BillingCategoryWithRelations extends BillingCategoryAttributes {
  materialRequisitions?: MaterialRequisition[];
  subCategories?: BillingSubCategory[];
  quotations?: Quotation[];
  workOrders?: WorkOrder[];
  procurementRfqs?: ProcurementRfq[];
  procurementAssetRfqs?: ProcurementAssetRfq[];
  procurementMaterialRequisitions?: ProcurementMaterialRequisition[];
  procurementAssetRequisitions?: ProcurementAssetRequisition[];
  procurementPurchaseOrders?: ProcurementPurchaseOrder[];
  procurementAssetPurchaseOrders?: ProcurementAssetPurchaseOrder[];
  procurementGrns?: ProcurementGrn[];
  procurementAssetGrns?: ProcurementAssetGrn[];
}
