// Auto-generated types for ProcurementWorkOrder
// Source: src/database/models/procurement/work-order/pr_procurement_work_order.model.ts

import { ProcurementWorkOrderMode } from '../models/procurement/work-order/pr_procurement_work_order.model';
import { ProcurementWorkOrderType } from '../models/procurement/work-order/pr_procurement_work_order.model';
import { ProcurementWorkOrderStatus } from '../models/procurement/work-order/pr_procurement_work_order.model';

import type { ServiceWorkRequisition } from '../models/projects/service-work-requisition/pr_service_work_requisition.model';
import type { Project } from '../models/projects/project/pr_project.model';
import type { Contractor } from '../models/projects/contract/pr_contractor.model';
import type { ProcurementWorkOrderItem } from '../models/procurement/work-order/pr_procurement_work_order_item.model';
import type { ProcurementWorkOrderMeasurement } from '../models/procurement/work-order/pr_work_order_measurement.model';
import type { ProcurementWorkBill } from '../models/procurement/work-order/pr_work_bill.model';
import type { SysOrganization } from '../models/system/sys_organization.model';

export interface ProcurementWorkOrderAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  work_order_no: string;
  title: string;
  mode: ProcurementWorkOrderMode;
  type: ProcurementWorkOrderType;
  requisition_id?: string | null;
  project_id: string;
  subcontractor_id: string;
  start_date?: string | null;
  end_date?: string | null;
  notes?: string | null;
  subtotal: number;
  vat_total: number;
  ait_tds_total: number;
  discount: number;
  contract_amount: number;
  status: ProcurementWorkOrderStatus;
  created_by?: string | null;
  updated_by?: string | null;
  deleted_by?: string | null;
  orgId?: number | null;

  // Relations
  requisition?: ServiceWorkRequisition;
  project?: Project;
  subcontractor?: Contractor;
  items?: ProcurementWorkOrderItem[];
  measurements?: ProcurementWorkOrderMeasurement[];
  workBills?: ProcurementWorkBill[];
  organization?: SysOrganization;
}

export interface ProcurementWorkOrderCreationAttributes {
  work_order_no: string;
  title: string;
  mode: ProcurementWorkOrderMode;
  type: ProcurementWorkOrderType;
  requisition_id?: string | null;
  project_id: string;
  subcontractor_id: string;
  start_date?: string | null;
  end_date?: string | null;
  notes?: string | null;
  subtotal?: number; // Has default value
  vat_total?: number; // Has default value
  ait_tds_total?: number; // Has default value
  discount?: number; // Has default value
  contract_amount?: number; // Has default value
  status?: ProcurementWorkOrderStatus; // Has default value
  created_by?: string | null;
  updated_by?: string | null;
  deleted_by?: string | null;
  orgId?: number | null;
}

export type ProcurementWorkOrderUpdateAttributes = Partial<ProcurementWorkOrderCreationAttributes>;

// Helper type for including relations
export interface ProcurementWorkOrderWithRelations extends ProcurementWorkOrderAttributes {
  requisition?: ServiceWorkRequisition;
  project?: Project;
  subcontractor?: Contractor;
  items?: ProcurementWorkOrderItem[];
  measurements?: ProcurementWorkOrderMeasurement[];
  workBills?: ProcurementWorkBill[];
  organization?: SysOrganization;
}
