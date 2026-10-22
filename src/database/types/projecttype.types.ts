// Auto-generated types for ProjectType
// Source: src\database\models\projects\project-type\pr_project_type.model.ts

import type { ProjectShareAssignment } from '../models/projects/project-share-assignment/pr_project_share_assignment.model';
import type { Invoice } from '../models/projects/billing/pr_invoice.model';
import type { WorkOrder } from '../models/projects/billing/work-order/pr_work_order.model';
import type { ProcurementRfq } from '../models/procurement/rfq/pr_rfq.model';
import type { ProcurementAssetRfq } from '../models/procurement/rfq/pr_asset_rfq.model';
import type { ProcurementMaterialRequisition } from '../models/procurement/requisition/pr_material_requisition.model';
import type { ProcurementAssetRequisition } from '../models/procurement/requisition/pr_asset_requisition.model';
import type { ProcurementPurchaseOrder } from '../models/procurement/purchase-order/pr_purchase_order.model';
import type { ProcurementAssetPurchaseOrder } from '../models/procurement/purchase-order/pr_asset_purchase_order.model';
import type { ProcurementGrn } from '../models/procurement/grn/pr_grn.model';
import type { ProcurementPurchaseBill } from '../models/procurement/purchase-bill/pr_purchase_bill.model';
import type { ProcurementAssetGrn } from '../models/procurement/grn/pr_asset_grn.model';
import type { ProcurementAssetPurchaseBill } from '../models/procurement/purchase-bill/pr_asset_purchase_bill.model';

export interface ProjectTypeAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  code: string;
  name: string;
  createdBy?: number | null;
  updatedBy?: number | null;
  deletedBy?: number | null;

  // Relations
  shareAssignments?: ProjectShareAssignment[];
  invoices?: Invoice[];
  workOrders?: WorkOrder[];
  procurementRfqs?: ProcurementRfq[];
  procurementAssetRfqs?: ProcurementAssetRfq[];
  procurementMaterialRequisitions?: ProcurementMaterialRequisition[];
  procurementAssetRequisitions?: ProcurementAssetRequisition[];
  procurementPurchaseOrders?: ProcurementPurchaseOrder[];
  procurementAssetPurchaseOrders?: ProcurementAssetPurchaseOrder[];
  procurementGrns?: ProcurementGrn[];
  procurementPurchaseBills?: ProcurementPurchaseBill[];
  procurementAssetGrns?: ProcurementAssetGrn[];
  procurementAssetPurchaseBills?: ProcurementAssetPurchaseBill[];
}

export interface ProjectTypeCreationAttributes {
  code: string;
  name: string;
  createdBy?: number | null;
  updatedBy?: number | null;
  deletedBy?: number | null;
}

export type ProjectTypeUpdateAttributes = Partial<ProjectTypeCreationAttributes>;

// Helper type for including relations
export interface ProjectTypeWithRelations extends ProjectTypeAttributes {
  shareAssignments?: ProjectShareAssignment[];
  invoices?: Invoice[];
  workOrders?: WorkOrder[];
  procurementRfqs?: ProcurementRfq[];
  procurementAssetRfqs?: ProcurementAssetRfq[];
  procurementMaterialRequisitions?: ProcurementMaterialRequisition[];
  procurementAssetRequisitions?: ProcurementAssetRequisition[];
  procurementPurchaseOrders?: ProcurementPurchaseOrder[];
  procurementAssetPurchaseOrders?: ProcurementAssetPurchaseOrder[];
  procurementGrns?: ProcurementGrn[];
  procurementPurchaseBills?: ProcurementPurchaseBill[];
  procurementAssetGrns?: ProcurementAssetGrn[];
  procurementAssetPurchaseBills?: ProcurementAssetPurchaseBill[];
}
