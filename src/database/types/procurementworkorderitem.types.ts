// Auto-generated types for ProcurementWorkOrderItem
// Source: src/database/models/procurement/work-order/pr_procurement_work_order_item.model.ts

import type { ProcurementWorkOrder } from '../models/procurement/work-order/pr_procurement_work_order.model';
import type { ServiceWorkRequisitionItem } from '../models/projects/service-work-requisition-item/pr_service_work_requisition_item.model';
import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface ProcurementWorkOrderItemAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  work_order_id: string;
  requisition_item_id?: string | null;
  description: string;
  unit?: string | null;
  quantity: number;
  rate: number;
  tax_percent: number;
  vat_percent: number;
  tax_amount: number;
  vat_amount: number;
  amount: number;
  orgId?: number | null;
  projectId?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;

  // Relations
  workOrder?: ProcurementWorkOrder;
  requisitionItem?: ServiceWorkRequisitionItem;
  organization?: SysOrganization;
  project?: Project;
}

export interface ProcurementWorkOrderItemCreationAttributes {
  work_order_id: string;
  requisition_item_id?: string | null;
  description: string;
  unit?: string | null;
  quantity: number;
  rate: number;
  tax_percent?: number; // Has default value
  vat_percent?: number; // Has default value
  tax_amount: number;
  vat_amount: number;
  amount: number;
  orgId?: number | null;
  projectId?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type ProcurementWorkOrderItemUpdateAttributes = Partial<ProcurementWorkOrderItemCreationAttributes>;

// Helper type for including relations
export interface ProcurementWorkOrderItemWithRelations extends ProcurementWorkOrderItemAttributes {
  workOrder?: ProcurementWorkOrder;
  requisitionItem?: ServiceWorkRequisitionItem;
  organization?: SysOrganization;
  project?: Project;
}
