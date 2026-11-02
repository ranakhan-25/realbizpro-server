// Auto-generated types for Task
// Source: src/database/models/projects/task/pr_task.model.ts

import { TaskPriority } from '../models/projects/task/pr_task.model';
import { TaskStatus } from '../models/projects/task/pr_task.model';

import type { ProcurementRfq } from '../models/procurement/rfq/pr_rfq.model';
import type { ProcurementAssetRfq } from '../models/procurement/rfq/pr_asset_rfq.model';
import type { ProcurementMaterialRequisition } from '../models/procurement/requisition/pr_material_requisition.model';
import type { ProcurementAssetRequisition } from '../models/procurement/requisition/pr_asset_requisition.model';
import type { ProcurementPurchaseOrder } from '../models/procurement/purchase-order/pr_purchase_order.model';
import type { ProcurementAssetPurchaseOrder } from '../models/procurement/purchase-order/pr_asset_purchase_order.model';
import type { ProcurementGrn } from '../models/procurement/grn/pr_grn.model';
import type { ProcurementAssetGrn } from '../models/procurement/grn/pr_asset_grn.model';

export interface TaskAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  uid?: string | null;
  taskName: string;
  progress: number;
  priority: TaskPriority;
  startDate?: Date | null;
  endDate?: Date | null;
  duration?: string | null;
  status: TaskStatus;
  completeDate?: Date | null;
  budget?: number | null;
  cost?: number | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;

  // Relations
  procurementRfqs?: ProcurementRfq[];
  procurementAssetRfqs?: ProcurementAssetRfq[];
  procurementMaterialRequisitions?: ProcurementMaterialRequisition[];
  procurementAssetRequisitions?: ProcurementAssetRequisition[];
  procurementPurchaseOrders?: ProcurementPurchaseOrder[];
  procurementAssetPurchaseOrders?: ProcurementAssetPurchaseOrder[];
  procurementGrns?: ProcurementGrn[];
  procurementAssetGrns?: ProcurementAssetGrn[];
}

export interface TaskCreationAttributes {
  uid?: string | null;
  taskName: string;
  progress?: number; // Has default value
  priority?: TaskPriority; // Has default value
  startDate?: Date | null;
  endDate?: Date | null;
  duration?: string | null;
  status?: TaskStatus; // Has default value
  completeDate?: Date | null;
  budget?: number | null;
  cost?: number | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type TaskUpdateAttributes = Partial<TaskCreationAttributes>;

// Helper type for including relations
export interface TaskWithRelations extends TaskAttributes {
  procurementRfqs?: ProcurementRfq[];
  procurementAssetRfqs?: ProcurementAssetRfq[];
  procurementMaterialRequisitions?: ProcurementMaterialRequisition[];
  procurementAssetRequisitions?: ProcurementAssetRequisition[];
  procurementPurchaseOrders?: ProcurementPurchaseOrder[];
  procurementAssetPurchaseOrders?: ProcurementAssetPurchaseOrder[];
  procurementGrns?: ProcurementGrn[];
  procurementAssetGrns?: ProcurementAssetGrn[];
}
