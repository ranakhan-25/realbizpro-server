// Auto-generated types for Category
// Source: src/database/models/procurement/configuration/products/pr_category.model.ts

import type { CategoryAccountMapping } from '../models/procurement/configuration/products/pr_category_account_mapping.model';
import type { ProcurementSubCategory } from '../models/procurement/configuration/products/pr_sub_category.model';
import type { ProcurementItemEntry } from '../models/procurement/configuration/products/pr_item_entry.model';
import type { ProcurementGrn } from '../models/procurement/grn/pr_grn.model';
import type { ProcurementRfq } from '../models/procurement/rfq/pr_rfq.model';
import type { ProcurementPurchaseOrder } from '../models/procurement/purchase-order/pr_purchase_order.model';
import type { ProcurementMaterialRequisition } from '../models/procurement/requisition/pr_material_requisition.model';
import type { ProcurementBoqItem } from '../models/procurement/boq/pr_procurement_boq_item.model';
import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface CategoryAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  uid?: string | null;
  type: string;
  code: string;
  name: string;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;

  // Relations
  accountMapping?: CategoryAccountMapping;
  subCategories?: ProcurementSubCategory[];
  itemEntries?: ProcurementItemEntry[];
  grns?: ProcurementGrn[];
  rfqs?: ProcurementRfq[];
  purchaseOrders?: ProcurementPurchaseOrder[];
  materialRequisitions?: ProcurementMaterialRequisition[];
  procurementBoqItems?: ProcurementBoqItem[];
  organization?: SysOrganization;
  project?: Project;
}

export interface CategoryCreationAttributes {
  uid?: string | null;
  type: string;
  code: string;
  name: string;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;
}

export type CategoryUpdateAttributes = Partial<CategoryCreationAttributes>;

// Helper type for including relations
export interface CategoryWithRelations extends CategoryAttributes {
  accountMapping?: CategoryAccountMapping;
  subCategories?: ProcurementSubCategory[];
  itemEntries?: ProcurementItemEntry[];
  grns?: ProcurementGrn[];
  rfqs?: ProcurementRfq[];
  purchaseOrders?: ProcurementPurchaseOrder[];
  materialRequisitions?: ProcurementMaterialRequisition[];
  procurementBoqItems?: ProcurementBoqItem[];
  organization?: SysOrganization;
  project?: Project;
}
