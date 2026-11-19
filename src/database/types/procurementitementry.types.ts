// Auto-generated types for ProcurementItemEntry
// Source: src/database/models/procurement/configuration/products/pr_item_entry.model.ts

import type { Category } from '../models/procurement/configuration/products/pr_category.model';
import type { ProcurementSubCategory } from '../models/procurement/configuration/products/pr_sub_category.model';
import type { ProcurementBrand } from '../models/procurement/configuration/products/pr_brand.model';
import type { ProcurementUnit } from '../models/procurement/configuration/products/pr_unit.model';
import type { ProcurementGrnItem } from '../models/procurement/grn/pr_grn_item.model';
import type { ProcurementRfqItem } from '../models/procurement/rfq/pr_rfq_item.model';
import type { ProcurementPurchaseOrderItem } from '../models/procurement/purchase-order/pr_purchase_order_item.model';
import type { ProcurementMaterialRequisitionItem } from '../models/procurement/requisition/pr_material_requisition_item.model';
import type { ProcurementBoqItem } from '../models/procurement/boq/pr_procurement_boq_item.model';
import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface ProcurementItemEntryAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  item_code: string;
  name: string;
  purchase_price: number;
  sale_price: number;
  category_id: string;
  sub_category_id?: string | null;
  brand_id?: string | null;
  unit_id: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;

  // Relations
  category?: Category;
  sub_category?: ProcurementSubCategory;
  brand?: ProcurementBrand;
  unit?: ProcurementUnit;
  grnItems?: ProcurementGrnItem[];
  rfqItems?: ProcurementRfqItem[];
  purchaseOrderItems?: ProcurementPurchaseOrderItem[];
  requisitionItems?: ProcurementMaterialRequisitionItem[];
  procurementBoqItems?: ProcurementBoqItem[];
  organization?: SysOrganization;
  project?: Project;
}

export interface ProcurementItemEntryCreationAttributes {
  item_code: string;
  name: string;
  purchase_price?: number; // Has default value
  sale_price?: number; // Has default value
  category_id: string;
  sub_category_id?: string | null;
  brand_id?: string | null;
  unit_id: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;
}

export type ProcurementItemEntryUpdateAttributes = Partial<ProcurementItemEntryCreationAttributes>;

// Helper type for including relations
export interface ProcurementItemEntryWithRelations extends ProcurementItemEntryAttributes {
  category?: Category;
  sub_category?: ProcurementSubCategory;
  brand?: ProcurementBrand;
  unit?: ProcurementUnit;
  grnItems?: ProcurementGrnItem[];
  rfqItems?: ProcurementRfqItem[];
  purchaseOrderItems?: ProcurementPurchaseOrderItem[];
  requisitionItems?: ProcurementMaterialRequisitionItem[];
  procurementBoqItems?: ProcurementBoqItem[];
  organization?: SysOrganization;
  project?: Project;
}
