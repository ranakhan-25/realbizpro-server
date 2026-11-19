// Auto-generated types for ProcurementPurchaseBillGrn
// Source: src/database/models/procurement/purchase-bill/pr_purchase_bill_grn.model.ts

import type { ProcurementPurchaseBill } from '../models/procurement/purchase-bill/pr_purchase_bill.model';
import type { ProcurementGrn } from '../models/procurement/grn/pr_grn.model';
import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface ProcurementPurchaseBillGrnAttributes {
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
  purchaseBill?: ProcurementPurchaseBill;
  grn?: ProcurementGrn;
  organization?: SysOrganization;
  project?: Project;
}

export interface ProcurementPurchaseBillGrnCreationAttributes {
  purchase_bill_id: string;
  grn_id: string;
  orgId?: number | null;
  projectId?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type ProcurementPurchaseBillGrnUpdateAttributes = Partial<ProcurementPurchaseBillGrnCreationAttributes>;

// Helper type for including relations
export interface ProcurementPurchaseBillGrnWithRelations extends ProcurementPurchaseBillGrnAttributes {
  purchaseBill?: ProcurementPurchaseBill;
  grn?: ProcurementGrn;
  organization?: SysOrganization;
  project?: Project;
}
