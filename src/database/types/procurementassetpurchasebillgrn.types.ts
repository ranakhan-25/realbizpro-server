// Auto-generated types for ProcurementAssetPurchaseBillGrn
// Source: src/database/models/procurement/purchase-bill/pr_asset_purchase_bill_grn.model.ts

import type { ProcurementAssetPurchaseBill } from '../models/procurement/purchase-bill/pr_asset_purchase_bill.model';
import type { ProcurementAssetGrn } from '../models/procurement/grn/pr_asset_grn.model';
import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface ProcurementAssetPurchaseBillGrnAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  purchase_bill_id: string;
  grn_id: string;
  orgId?: number | null;
  projectId?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;

  // Relations
  purchaseBill?: ProcurementAssetPurchaseBill;
  grn?: ProcurementAssetGrn;
  organization?: SysOrganization;
  project?: Project;
}

export interface ProcurementAssetPurchaseBillGrnCreationAttributes {
  purchase_bill_id: string;
  grn_id: string;
  orgId?: number | null;
  projectId?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type ProcurementAssetPurchaseBillGrnUpdateAttributes = Partial<ProcurementAssetPurchaseBillGrnCreationAttributes>;

// Helper type for including relations
export interface ProcurementAssetPurchaseBillGrnWithRelations extends ProcurementAssetPurchaseBillGrnAttributes {
  purchaseBill?: ProcurementAssetPurchaseBill;
  grn?: ProcurementAssetGrn;
  organization?: SysOrganization;
  project?: Project;
}
