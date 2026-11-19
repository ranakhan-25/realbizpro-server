// Auto-generated types for ProcurementHireOrderItem
// Source: src/database/models/procurement/equipment-hire/pr_hire_order_item.model.ts

import type { ProcurementHireOrder } from '../models/procurement/equipment-hire/pr_hire_order.model';
import type { ProcurementAssetItemEntry } from '../models/procurement/configuration/asset/pr_asset_item_entry.model';
import type { ProcurementAssetRequisitionItem } from '../models/procurement/requisition/pr_asset_requisition_item.model';
import type { ProcurementUnit } from '../models/procurement/configuration/products/pr_unit.model';
import type { ProcurementHireInItem } from '../models/procurement/equipment-hire/pr_hire_in_item.model';
import type { ProcurementHireOutItem } from '../models/procurement/equipment-hire/pr_hire_out_item.model';
import type { ProcurementHireBillItem } from '../models/procurement/equipment-hire/pr_hire_bill_item.model';
import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface ProcurementHireOrderItemAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  hire_order_id: string;
  equipment_id?: string | null;
  requisition_item_id?: string | null;
  unit_id?: string | null;
  equipment_description: string;
  unit: string;
  quantity: number;
  charged_by: string;
  rate: number;
  tax_percent: number;
  vat_percent: number;
  tax_amount: number;
  vat_amount: number;
  amount: number;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;

  // Relations
  hireOrder?: ProcurementHireOrder;
  equipment?: ProcurementAssetItemEntry;
  requisitionItem?: ProcurementAssetRequisitionItem;
  unitRelation?: ProcurementUnit;
  hireInItems?: ProcurementHireInItem[];
  hireOutItems?: ProcurementHireOutItem[];
  billItems?: ProcurementHireBillItem[];
  organization?: SysOrganization;
  project?: Project;
}

export interface ProcurementHireOrderItemCreationAttributes {
  hire_order_id: string;
  equipment_id?: string | null;
  requisition_item_id?: string | null;
  unit_id?: string | null;
  equipment_description: string;
  unit: string;
  quantity: number;
  charged_by?: string; // Has default value
  rate?: number; // Has default value
  tax_percent?: number; // Has default value
  vat_percent?: number; // Has default value
  tax_amount?: number; // Has default value
  vat_amount?: number; // Has default value
  amount?: number; // Has default value
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;
}

export type ProcurementHireOrderItemUpdateAttributes = Partial<ProcurementHireOrderItemCreationAttributes>;

// Helper type for including relations
export interface ProcurementHireOrderItemWithRelations extends ProcurementHireOrderItemAttributes {
  hireOrder?: ProcurementHireOrder;
  equipment?: ProcurementAssetItemEntry;
  requisitionItem?: ProcurementAssetRequisitionItem;
  unitRelation?: ProcurementUnit;
  hireInItems?: ProcurementHireInItem[];
  hireOutItems?: ProcurementHireOutItem[];
  billItems?: ProcurementHireBillItem[];
  organization?: SysOrganization;
  project?: Project;
}
