// Auto-generated types for SupplierAccounts
// Source: src\database\models\projects\contract\pr_supplier_accounts.model.ts

import { SupplierAccountsStatus } from '../models/projects/contract/pr_supplier_accounts.model';

import type { ProcurementRfq } from '../models/procurement/rfq/pr_rfq.model';
import type { ProcurementAssetRfq } from '../models/procurement/rfq/pr_asset_rfq.model';
import type { ProcurementMaterialRequisition } from '../models/procurement/requisition/pr_material_requisition.model';
import type { ProcurementAssetRequisition } from '../models/procurement/requisition/pr_asset_requisition.model';
import type { ProcurementPurchaseOrder } from '../models/procurement/purchase-order/pr_purchase_order.model';
import type { ProcurementAssetPurchaseOrder } from '../models/procurement/purchase-order/pr_asset_purchase_order.model';
import type { ProcurementGrn } from '../models/procurement/grn/pr_grn.model';
import type { ProcurementPurchaseBill } from '../models/procurement/purchase-bill/pr_purchase_bill.model';
import type { ProcurementAssetGrn } from '../models/procurement/grn/pr_asset_grn.model';
import type { ProcurementAssetPurchaseBill } from '../models/procurement/purchase-bill/pr_asset_purchase_bill.model';
import type { ProcurementHireOrder } from '../models/procurement/equipment-hire/pr_hire_order.model';
import type { ProcurementHireBill } from '../models/procurement/equipment-hire/pr_hire_bill.model';
import type { SysOrganization } from '../models/system/sys_organization.model';

export interface SupplierAccountsAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  supplierCode: string;
  supplierName: string;
  businessName?: string | null;
  email?: string | null;
  phone: string;
  address?: string | null;
  creditLimit?: number | null;
  dueDate?: Date | null;
  underGroup?: string | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  status: SupplierAccountsStatus;
  orgId?: number | null;

  // Relations
  procurementRfqs?: ProcurementRfq[];
  procurementAssetRfqs?: ProcurementAssetRfq[];
  procurementMaterialRequisitions?: ProcurementMaterialRequisition[];
  procurementAssetRequisitions?: ProcurementAssetRequisition[];
  procurementPurchaseOrders?: ProcurementPurchaseOrder[];
  procurementAssetPurchaseOrders?: ProcurementAssetPurchaseOrder[];
  procurementGrns?: ProcurementGrn[];
  procurementPurchaseBills?: ProcurementPurchaseBill[];
  procurementAssetGrns?: ProcurementAssetGrn[];
  procurementAssetPurchaseBills?: ProcurementAssetPurchaseBill[];
  equipmentHireOrders?: ProcurementHireOrder[];
  equipmentHireBills?: ProcurementHireBill[];
  organization?: SysOrganization;
}

export interface SupplierAccountsCreationAttributes {
  supplierCode: string;
  supplierName: string;
  businessName?: string | null;
  email?: string | null;
  phone: string;
  address?: string | null;
  creditLimit?: number | null;
  dueDate?: Date | null;
  underGroup?: string | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  status?: SupplierAccountsStatus; // Has default value
  orgId?: number | null;
}

export type SupplierAccountsUpdateAttributes = Partial<SupplierAccountsCreationAttributes>;

// Helper type for including relations
export interface SupplierAccountsWithRelations extends SupplierAccountsAttributes {
  procurementRfqs?: ProcurementRfq[];
  procurementAssetRfqs?: ProcurementAssetRfq[];
  procurementMaterialRequisitions?: ProcurementMaterialRequisition[];
  procurementAssetRequisitions?: ProcurementAssetRequisition[];
  procurementPurchaseOrders?: ProcurementPurchaseOrder[];
  procurementAssetPurchaseOrders?: ProcurementAssetPurchaseOrder[];
  procurementGrns?: ProcurementGrn[];
  procurementPurchaseBills?: ProcurementPurchaseBill[];
  procurementAssetGrns?: ProcurementAssetGrn[];
  procurementAssetPurchaseBills?: ProcurementAssetPurchaseBill[];
  equipmentHireOrders?: ProcurementHireOrder[];
  equipmentHireBills?: ProcurementHireBill[];
  organization?: SysOrganization;
}
