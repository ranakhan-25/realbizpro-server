// Auto-generated types for ProcurementBoqItem
// Source: src/database/models/procurement/boq/pr_procurement_boq_item.model.ts

import { ProcurementBoqCostType } from '../models/procurement/boq/pr_procurement_boq_item.model';

import type { ProcurementBoq } from '../models/procurement/boq/pr_procurement_boq.model';
import type { ProcurementItemEntry } from '../models/procurement/configuration/products/pr_item_entry.model';
import type { Category } from '../models/procurement/configuration/products/pr_category.model';
import type { ProcurementUnit } from '../models/procurement/configuration/products/pr_unit.model';
import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface ProcurementBoqItemAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  boq_id: string;
  item_id?: string | null;
  category_id?: string | null;
  unit_id?: string | null;
  item_name: string;
  item_code?: string | null;
  unit: string;
  quantity: number;
  rate: number;
  amount: number;
  cost_type: ProcurementBoqCostType;
  remarks?: string | null;
  sort_order: number;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;

  // Relations
  boq?: ProcurementBoq;
  item?: ProcurementItemEntry;
  category?: Category;
  unitRelation?: ProcurementUnit;
  organization?: SysOrganization;
  project?: Project;
}

export interface ProcurementBoqItemCreationAttributes {
  boq_id: string;
  item_id?: string | null;
  category_id?: string | null;
  unit_id?: string | null;
  item_name: string;
  item_code?: string | null;
  unit: string;
  quantity?: number; // Has default value
  rate?: number; // Has default value
  amount?: number; // Has default value
  cost_type?: ProcurementBoqCostType; // Has default value
  remarks?: string | null;
  sort_order?: number; // Has default value
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;
}

export type ProcurementBoqItemUpdateAttributes = Partial<ProcurementBoqItemCreationAttributes>;

// Helper type for including relations
export interface ProcurementBoqItemWithRelations extends ProcurementBoqItemAttributes {
  boq?: ProcurementBoq;
  item?: ProcurementItemEntry;
  category?: Category;
  unitRelation?: ProcurementUnit;
  organization?: SysOrganization;
  project?: Project;
}
