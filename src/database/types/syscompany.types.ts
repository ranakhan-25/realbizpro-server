// Auto-generated types for SysCompany
// Source: src\database\models\system\sys_company.model.ts

import type { ProcurementRfq } from '../models/procurement/rfq/pr_rfq.model';
import type { ProcurementAssetRfq } from '../models/procurement/rfq/pr_asset_rfq.model';
import type { ProcurementMaterialRequisition } from '../models/procurement/requisition/pr_material_requisition.model';
import type { ProcurementAssetRequisition } from '../models/procurement/requisition/pr_asset_requisition.model';
import type { ProcurementPurchaseOrder } from '../models/procurement/purchase-order/pr_purchase_order.model';
import type { ProcurementAssetPurchaseOrder } from '../models/procurement/purchase-order/pr_asset_purchase_order.model';
import type { ProcurementGrn } from '../models/procurement/grn/pr_grn.model';
import type { ProcurementPurchaseBill } from '../models/procurement/purchase-bill/pr_purchase_bill.model';

export interface SysCompanyAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  name: string;
  address: string | null;
  bnName?: string | null;
  bnAddress: string | null;
  mobile: string | null;
  telephone?: string | null;
  ipPhone?: string | null;
  vatRegNum: string | null;
  email: string | null;
  website: string | null;
  logo: string | null;
  status: 'Active' | 'Inactive';
  createdBy: number | null;
  deletedBy: number | null;
  updatedBy?: number | null;

  // Relations
  procurementRfqs?: ProcurementRfq[];
  procurementAssetRfqs?: ProcurementAssetRfq[];
  procurementMaterialRequisitions?: ProcurementMaterialRequisition[];
  procurementAssetRequisitions?: ProcurementAssetRequisition[];
  procurementPurchaseOrders?: ProcurementPurchaseOrder[];
  procurementAssetPurchaseOrders?: ProcurementAssetPurchaseOrder[];
  procurementGrns?: ProcurementGrn[];
  procurementPurchaseBills?: ProcurementPurchaseBill[];
}

export interface SysCompanyCreationAttributes {
  name: string;
  address?: string | null; // Nullable
  bnName?: string | null;
  bnAddress?: string | null; // Nullable
  mobile?: string | null; // Nullable
  telephone?: string | null;
  ipPhone?: string | null;
  vatRegNum?: string | null; // Nullable
  email?: string | null; // Nullable
  website?: string | null; // Nullable
  logo?: string | null; // Nullable
  status?: 'Active' | 'Inactive'; // Has default value
  createdBy?: number | null; // Nullable
  deletedBy?: number | null; // Nullable
  updatedBy?: number | null;
}

export type SysCompanyUpdateAttributes = Partial<SysCompanyCreationAttributes>;

// Helper type for including relations
export interface SysCompanyWithRelations extends SysCompanyAttributes {
  procurementRfqs?: ProcurementRfq[];
  procurementAssetRfqs?: ProcurementAssetRfq[];
  procurementMaterialRequisitions?: ProcurementMaterialRequisition[];
  procurementAssetRequisitions?: ProcurementAssetRequisition[];
  procurementPurchaseOrders?: ProcurementPurchaseOrder[];
  procurementAssetPurchaseOrders?: ProcurementAssetPurchaseOrder[];
  procurementGrns?: ProcurementGrn[];
  procurementPurchaseBills?: ProcurementPurchaseBill[];
}
