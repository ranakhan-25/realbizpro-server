// Auto-generated types for ProcurementWorkOrderMeasurement
// Source: src/database/models/procurement/work-order/pr_work_order_measurement.model.ts

import type { ProcurementWorkOrder } from '../models/procurement/work-order/pr_procurement_work_order.model';
import type { Project } from '../models/projects/project/pr_project.model';
import type { ProcurementWorkBill } from '../models/procurement/work-order/pr_work_bill.model';
import type { SysOrganization } from '../models/system/sys_organization.model';

export interface ProcurementWorkOrderMeasurementAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  measurement_no: string;
  work_order_id: string;
  project_id: string;
  date: string;
  amount: number;
  status: string;
  is_billed: boolean;
  notes?: string | null;
  orgId?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;

  // Relations
  workOrder?: ProcurementWorkOrder;
  project?: Project;
  workBill?: ProcurementWorkBill;
  organization?: SysOrganization;
}

export interface ProcurementWorkOrderMeasurementCreationAttributes {
  measurement_no: string;
  work_order_id: string;
  project_id: string;
  date: string;
  amount?: number; // Has default value
  status?: string; // Has default value
  is_billed?: boolean; // Has default value
  notes?: string | null;
  orgId?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type ProcurementWorkOrderMeasurementUpdateAttributes = Partial<ProcurementWorkOrderMeasurementCreationAttributes>;

// Helper type for including relations
export interface ProcurementWorkOrderMeasurementWithRelations extends ProcurementWorkOrderMeasurementAttributes {
  workOrder?: ProcurementWorkOrder;
  project?: Project;
  workBill?: ProcurementWorkBill;
  organization?: SysOrganization;
}
