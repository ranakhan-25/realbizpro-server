// Auto-generated types for ServiceWorkRequisitionItem
// Source: src\database\models\projects\service-work-requisition-item\pr_service_work_requisition_item.model.ts

import type { ServiceWorkRequisition } from '../models/projects/service-work-requisition/pr_service_work_requisition.model';
import type { SysOrganization } from '../models/system/sys_organization.model';

export interface ServiceWorkRequisitionItemAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  serviceWorkRequisitionId: string;
  date: Date;
  code: string;
  serviceItemName: string;
  unitType?: string | null;
  qtyDays: number;
  rate: number;
  scopeDetailsOrRemarks?: string | null;
  amount: number;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;

  // Relations
  requisition?: ServiceWorkRequisition;
  organization?: SysOrganization;
}

export interface ServiceWorkRequisitionItemCreationAttributes {
  serviceWorkRequisitionId: string;
  date: Date;
  code: string;
  serviceItemName: string;
  unitType?: string | null;
  qtyDays?: number; // Has default value
  rate?: number; // Has default value
  scopeDetailsOrRemarks?: string | null;
  amount?: number; // Has default value
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
}

export type ServiceWorkRequisitionItemUpdateAttributes = Partial<ServiceWorkRequisitionItemCreationAttributes>;

// Helper type for including relations
export interface ServiceWorkRequisitionItemWithRelations extends ServiceWorkRequisitionItemAttributes {
  requisition?: ServiceWorkRequisition;
  organization?: SysOrganization;
}
