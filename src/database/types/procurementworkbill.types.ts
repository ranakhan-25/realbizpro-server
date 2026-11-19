// Auto-generated types for ProcurementWorkBill
// Source: src/database/models/procurement/work-order/pr_work_bill.model.ts

import { ProcurementWorkBillStatus } from '../models/procurement/work-order/pr_work_bill.model';

import type { ProcurementWorkOrderMeasurement } from '../models/procurement/work-order/pr_work_order_measurement.model';
import type { ProcurementWorkOrder } from '../models/procurement/work-order/pr_procurement_work_order.model';
import type { Project } from '../models/projects/project/pr_project.model';
import type { Contractor } from '../models/projects/contract/pr_contractor.model';
import type { SysOrganization } from '../models/system/sys_organization.model';

export interface ProcurementWorkBillAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  bill_no: string;
  measurement_id: string;
  work_order_id: string;
  project_id: string;
  vendor_id: string;
  net_amount: number;
  status: ProcurementWorkBillStatus;
  created_by?: string | null;
  updated_by?: string | null;
  deleted_by?: string | null;
  orgId?: number | null;

  // Relations
  measurement?: ProcurementWorkOrderMeasurement;
  workOrder?: ProcurementWorkOrder;
  project?: Project;
  vendor?: Contractor;
  organization?: SysOrganization;
}

export interface ProcurementWorkBillCreationAttributes {
  bill_no: string;
  measurement_id: string;
  work_order_id: string;
  project_id: string;
  vendor_id: string;
  net_amount?: number; // Has default value
  status?: ProcurementWorkBillStatus; // Has default value
  created_by?: string | null;
  updated_by?: string | null;
  deleted_by?: string | null;
  orgId?: number | null;
}

export type ProcurementWorkBillUpdateAttributes = Partial<ProcurementWorkBillCreationAttributes>;

// Helper type for including relations
export interface ProcurementWorkBillWithRelations extends ProcurementWorkBillAttributes {
  measurement?: ProcurementWorkOrderMeasurement;
  workOrder?: ProcurementWorkOrder;
  project?: Project;
  vendor?: Contractor;
  organization?: SysOrganization;
}
