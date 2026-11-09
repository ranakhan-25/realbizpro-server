// Auto-generated types for Site
// Source: src/database/models/projects/project-site/pr_project_site.model.ts

import type { Project } from '../models/projects/project/pr_project.model';
import type { MaterialRequisition } from '../models/projects/material-requisition/pr_material_requisition.model';
import type { ProjectShareAssignment } from '../models/projects/project-share-assignment/pr_project_share_assignment.model';
import type { WorkOrder } from '../models/projects/billing/work-order/pr_work_order.model';
import type { ProcurementRfq } from '../models/procurement/rfq/pr_rfq.model';
import type { ProcurementAssetRfq } from '../models/procurement/rfq/pr_asset_rfq.model';
import type { ProcurementMaterialRequisition } from '../models/procurement/requisition/pr_material_requisition.model';
import type { ProcurementAssetRequisition } from '../models/procurement/requisition/pr_asset_requisition.model';
import type { ProcurementPurchaseOrder } from '../models/procurement/purchase-order/pr_purchase_order.model';
import type { ProcurementAssetPurchaseOrder } from '../models/procurement/purchase-order/pr_asset_purchase_order.model';
import type { ProcurementGrn } from '../models/procurement/grn/pr_grn.model';
import type { ProcurementAssetGrn } from '../models/procurement/grn/pr_asset_grn.model';
import type { ProcurementHireOrder } from '../models/procurement/equipment-hire/pr_hire_order.model';
import type { SysOrganization } from '../models/system/sys_organization.model';

export interface SiteAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  code: string;
  name: string;
  location?: string | null;
  description?: string | null;
  projectId: string;
  createdBy?: string | null;
  updatedBy?: any | null;
  deletedBy?: string | null;
  orgId?: number | null;

  // Relations
  project?: Project;
  materialRequisitions?: MaterialRequisition[];
  shareAssignments?: ProjectShareAssignment[];
  workOrders?: WorkOrder[];
  procurementRfqs?: ProcurementRfq[];
  procurementAssetRfqs?: ProcurementAssetRfq[];
  procurementMaterialRequisitions?: ProcurementMaterialRequisition[];
  procurementAssetRequisitions?: ProcurementAssetRequisition[];
  procurementPurchaseOrders?: ProcurementPurchaseOrder[];
  procurementAssetPurchaseOrders?: ProcurementAssetPurchaseOrder[];
  procurementGrns?: ProcurementGrn[];
  procurementAssetGrns?: ProcurementAssetGrn[];
  equipmentHireOrders?: ProcurementHireOrder[];
  organization?: SysOrganization;
}

export interface SiteCreationAttributes {
  code: string;
  name: string;
  location?: string | null;
  description?: string | null;
  projectId: string;
  createdBy?: string | null;
  updatedBy?: any | null;
  deletedBy?: string | null;
  orgId?: number | null;
}

export type SiteUpdateAttributes = Partial<SiteCreationAttributes>;

// Helper type for including relations
export interface SiteWithRelations extends SiteAttributes {
  project?: Project;
  materialRequisitions?: MaterialRequisition[];
  shareAssignments?: ProjectShareAssignment[];
  workOrders?: WorkOrder[];
  procurementRfqs?: ProcurementRfq[];
  procurementAssetRfqs?: ProcurementAssetRfq[];
  procurementMaterialRequisitions?: ProcurementMaterialRequisition[];
  procurementAssetRequisitions?: ProcurementAssetRequisition[];
  procurementPurchaseOrders?: ProcurementPurchaseOrder[];
  procurementAssetPurchaseOrders?: ProcurementAssetPurchaseOrder[];
  procurementGrns?: ProcurementGrn[];
  procurementAssetGrns?: ProcurementAssetGrn[];
  equipmentHireOrders?: ProcurementHireOrder[];
  organization?: SysOrganization;
}
