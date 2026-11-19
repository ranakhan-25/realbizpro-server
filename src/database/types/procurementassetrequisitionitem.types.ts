// Auto-generated types for ProcurementAssetRequisitionItem
// Source: src/database/models/procurement/requisition/pr_asset_requisition_item.model.ts

import type { ProcurementAssetRequisition } from '../models/procurement/requisition/pr_asset_requisition.model';
import type { ProcurementAssetItemEntry } from '../models/procurement/configuration/asset/pr_asset_item_entry.model';
import type { ProcurementUnit } from '../models/procurement/configuration/products/pr_unit.model';
import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface ProcurementAssetRequisitionItemAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  requisition_id: string;
  item_id?: string | null;
  unit_id?: string | null;
  item_code: string;
  item_name?: string | null;
  details?: string | null;
  unit?: string | null;
  demand_qty: number;
  rate: number;
  amount: number;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;

  // Relations
  requisition?: ProcurementAssetRequisition;
  item?: ProcurementAssetItemEntry;
  unitRelation?: ProcurementUnit;
  organization?: SysOrganization;
  project?: Project;
}

export interface ProcurementAssetRequisitionItemCreationAttributes {
  requisition_id: string;
  item_id?: string | null;
  unit_id?: string | null;
  item_code: string;
  item_name?: string | null;
  details?: string | null;
  unit?: string | null;
  demand_qty?: number; // Has default value
  rate?: number; // Has default value
  amount?: number; // Has default value
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;
}

export type ProcurementAssetRequisitionItemUpdateAttributes = Partial<ProcurementAssetRequisitionItemCreationAttributes>;

// Helper type for including relations
export interface ProcurementAssetRequisitionItemWithRelations extends ProcurementAssetRequisitionItemAttributes {
  requisition?: ProcurementAssetRequisition;
  item?: ProcurementAssetItemEntry;
  unitRelation?: ProcurementUnit;
  organization?: SysOrganization;
  project?: Project;
}
