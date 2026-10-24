// Auto-generated types for SysUser
// Source: src/database/models/system/sys_user.model.ts

import type { SysFileModel } from '../models/system/sys_file.model';
import type { SysRole } from '../models/system/sys_role.model';
import type { SysModules } from '../models/system/sys_module.model';
import type { SysPermission } from '../models/system/sys_permission.model';
import type { SysUserToken } from '../models/system/sys_user_token.model';
import type { SysUserPermission } from '../models/system/sys_user_permission.model';
import type { SysCompany } from '../models/system/sys_company.model';
import type { SysUserCompany } from '../models/system/sys_user_company.model';
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
import type { ProcurementBoq } from '../models/procurement/boq/pr_procurement_boq.model';
import type { ProcurementHireOrder } from '../models/procurement/equipment-hire/pr_hire_order.model';
import type { ProcurementHireIn } from '../models/procurement/equipment-hire/pr_hire_in.model';
import type { ProcurementHireOut } from '../models/procurement/equipment-hire/pr_hire_out.model';
import type { ProcurementHireBill } from '../models/procurement/equipment-hire/pr_hire_bill.model';
import type { ProcurementMaterialIssue } from '../models/procurement/material-issue/pr_material_issue.model';

export interface SysUserAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  name: string;
  email: string;
  mobile?: string | null;
  password: string;
  userCode?: string | null;
  designationName?: string | null;
  fileId?: number | null;
  fcmToken?: string | null;
  receivingPointId?: number | null;
  employeeId?: number | null;
  distributionId?: number | null;
  warehouseId?: number | null;
  factoryId?: number | null;
  unitId?: number | null;
  userType: string;
  refreshTokenExpiresAt?: Date | null;
  designationId?: number | null;
  lastLoginAt?: Date | null;
  firstName?: string | null;
  lastName?: string | null;
  username?: string | null;
  phone?: string | null;
  isSuperUser?: boolean | null;
  isActive?: boolean | null;
  passwordHash?: string | null;
  refreshToken?: string | null;
  lastLogoutAt?: Date | null;

  // Relations
  avatar?: SysFileModel;
  roles?: SysRole[];
  modules?: SysModules[];
  permissions?: SysPermission[];
  tokens?: SysUserToken[];
  userPermissions?: SysUserPermission[];
  companies?: SysCompany[];
  userCompanies?: SysUserCompany[];
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
  responsibleProcurementBoqs?: ProcurementBoq[];
  createdProcurementBoqs?: ProcurementBoq[];
  createdEquipmentHireOrders?: ProcurementHireOrder[];
  equipmentHireIns?: ProcurementHireIn[];
  equipmentHireOuts?: ProcurementHireOut[];
  equipmentHireBills?: ProcurementHireBill[];
  procurementMaterialIssues?: ProcurementMaterialIssue[];
  createdProcurementMaterialIssues?: ProcurementMaterialIssue[];
}

export interface SysUserCreationAttributes {
  name: string;
  email: string;
  mobile?: string | null;
  password: string;
  userCode?: string | null;
  designationName?: string | null;
  fileId?: number | null;
  fcmToken?: string | null;
  receivingPointId?: number | null;
  employeeId?: number | null;
  distributionId?: number | null;
  warehouseId?: number | null;
  factoryId?: number | null;
  unitId?: number | null;
  userType?: string; // Has default value
  refreshTokenExpiresAt?: Date | null;
  designationId?: number | null;
  lastLoginAt?: Date | null;
  firstName?: string | null;
  lastName?: string | null;
  username?: string | null;
  phone?: string | null;
  isSuperUser?: boolean | null;
  isActive?: boolean | null;
  passwordHash?: string | null;
  refreshToken?: string | null;
  lastLogoutAt?: Date | null;
}

export type SysUserUpdateAttributes = Partial<SysUserCreationAttributes>;

// Helper type for including relations
export interface SysUserWithRelations extends SysUserAttributes {
  avatar?: SysFileModel;
  roles?: SysRole[];
  modules?: SysModules[];
  permissions?: SysPermission[];
  tokens?: SysUserToken[];
  userPermissions?: SysUserPermission[];
  companies?: SysCompany[];
  userCompanies?: SysUserCompany[];
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
  responsibleProcurementBoqs?: ProcurementBoq[];
  createdProcurementBoqs?: ProcurementBoq[];
  createdEquipmentHireOrders?: ProcurementHireOrder[];
  equipmentHireIns?: ProcurementHireIn[];
  equipmentHireOuts?: ProcurementHireOut[];
  equipmentHireBills?: ProcurementHireBill[];
  procurementMaterialIssues?: ProcurementMaterialIssue[];
  createdProcurementMaterialIssues?: ProcurementMaterialIssue[];
}
