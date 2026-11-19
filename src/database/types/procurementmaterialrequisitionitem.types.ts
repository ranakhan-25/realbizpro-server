// Auto-generated types for ProcurementMaterialRequisitionItem
// Source: src/database/models/procurement/requisition/pr_material_requisition_item.model.ts

import type { ProcurementMaterialRequisition } from '../models/procurement/requisition/pr_material_requisition.model';
import type { ProcurementItemEntry } from '../models/procurement/configuration/products/pr_item_entry.model';
import type { ProcurementUnit } from '../models/procurement/configuration/products/pr_unit.model';
import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface ProcurementMaterialRequisitionItemAttributes {
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
  budget_qty: number;
  already_purchase_qty: number;
  available_qty: number;
  demand_qty: number;
  stock: number;
  rate: number;
  amount: number;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;

  // Relations
  requisition?: ProcurementMaterialRequisition;
  item?: ProcurementItemEntry;
  unitRelation?: ProcurementUnit;
  organization?: SysOrganization;
  project?: Project;
}

export interface ProcurementMaterialRequisitionItemCreationAttributes {
  requisition_id: string;
  item_id?: string | null;
  unit_id?: string | null;
  item_code: string;
  item_name?: string | null;
  details?: string | null;
  unit?: string | null;
  budget_qty?: number; // Has default value
  already_purchase_qty?: number; // Has default value
  available_qty?: number; // Has default value
  demand_qty?: number; // Has default value
  stock?: number; // Has default value
  rate?: number; // Has default value
  amount?: number; // Has default value
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;
}

export type ProcurementMaterialRequisitionItemUpdateAttributes = Partial<ProcurementMaterialRequisitionItemCreationAttributes>;

// Helper type for including relations
export interface ProcurementMaterialRequisitionItemWithRelations extends ProcurementMaterialRequisitionItemAttributes {
  requisition?: ProcurementMaterialRequisition;
  item?: ProcurementItemEntry;
  unitRelation?: ProcurementUnit;
  organization?: SysOrganization;
  project?: Project;
}
