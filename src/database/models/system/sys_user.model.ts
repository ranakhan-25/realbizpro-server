import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from '../../base.model';

import type {
  SysUserAttributes,
  SysUserCreationAttributes,
} from '../../types/sysuser.types';

import { SysFileModel } from './sys_file.model';
import { SysModules } from './sys_module.model';
import { SysModuleToUser } from './sys_module_to_user.model';
import { SysPermission } from './sys_permission.model';
import { SysRole } from './sys_role.model';
import { SysUserPermission } from './sys_user_permission.model';
import { SysUserRole } from './sys_user_role.model';
import { SysUserSection } from './sys_user_section.model';
import { SysUserToken } from './sys_user_token.model';
import { SysCompany } from './sys_company.model';
import { SysUserCompany } from './sys_user_company.model';
import { SysOrganization } from './sys_organization.model';
import { SysUserFeatureOverride } from './sys_user_feature_override.model';
import { ProcurementRfq } from '../procurement/rfq/pr_rfq.model';
import { ProcurementAssetRfq } from '../procurement/rfq/pr_asset_rfq.model';
import { ProcurementMaterialRequisition } from '../procurement/requisition/pr_material_requisition.model';
import { ProcurementMaterialIssue } from '../procurement/material-issue/pr_material_issue.model';
import { ProcurementAssetRequisition } from '../procurement/requisition/pr_asset_requisition.model';
import { ProcurementPurchaseOrder } from '../procurement/purchase-order/pr_purchase_order.model';
import { ProcurementAssetPurchaseOrder } from '../procurement/purchase-order/pr_asset_purchase_order.model';
import { ProcurementGrn } from '../procurement/grn/pr_grn.model';
import { ProcurementPurchaseBill } from '../procurement/purchase-bill/pr_purchase_bill.model';
import { ProcurementAssetPurchaseBill } from '../procurement/purchase-bill/pr_asset_purchase_bill.model';
import { ProcurementBoq } from '../procurement/boq/pr_procurement_boq.model';
import { ProcurementHireOrder } from '../procurement/equipment-hire/pr_hire_order.model';
import { ProcurementHireIn } from '../procurement/equipment-hire/pr_hire_in.model';
import { ProcurementHireOut } from '../procurement/equipment-hire/pr_hire_out.model';
import { ProcurementHireBill } from '../procurement/equipment-hire/pr_hire_bill.model';
import { ProcurementAssetGrn } from '../procurement/grn/pr_asset_grn.model';

export enum UserTypeEnum {
  SHOWROOM = 'Showroom',
  DISTRIBUTION = 'Distribution',
  WAREHOUSE = 'Warehouse',
  FACTORY = 'Factory',
  PRODUCTION_UNIT = 'Production Unit',
  HEAD_OFFICE = 'Head Office',
  OFFICE = 'Office',
  EMPLOYEE = 'Employee',
  POS = 'Pos',
}

@Table({
  tableName: 'sys_users',
  timestamps: true,
  underscored: true,
})
export class SysUser
  extends BaseModel<
    SysUserAttributes,
    SysUserCreationAttributes
  >
  implements SysUserAttributes
{
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    field: 'name',
  })
  declare name: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    unique: true,
    field: 'email',
  })
  declare email: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
    unique: true,
    field: 'mobile',
  })
  declare mobile?: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    field: 'password',
  })
  declare password: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
    field: 'user_code',
  })
  declare userCode?: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    field: 'designation',
  })
  declare designationName?: string;

  @ForeignKey(() => SysFileModel)
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    field: 'file_id',
  })
  declare fileId?: number;

  @BelongsTo(() => SysFileModel, 'fileId')
  declare avatar?: SysFileModel;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    field: 'fcm_token',
  })
  declare fcmToken?: string;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    field: 'receiving_point_id',
  })
  declare receivingPointId?: number;

  //column employee id belongs to model HrmEmployee
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    field: 'employee_id',
  })
  declare employeeId?: number;

  //relation with distribution when distribution user
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    field: 'distribution_id',
  })
  declare distributionId?: number;

  //relation with warehouse when warehouse user
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    field: 'warehouse_id',
  })
  declare warehouseId?: number;

  //relation with factory when factory user
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    field: 'factory_id',
  })
  declare factoryId?: number;

  //relation with production unit when Production Unit user
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    field: 'unit_id',
  })
  declare unitId?: number;

  @Column({
    field: 'user_type',
    type: DataType.STRING(50),
    allowNull: false,
    defaultValue: UserTypeEnum.OFFICE,
  })
  declare userType: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'refresh_token_expires_at',
  })
  declare refreshTokenExpiresAt?: Date | null;

  //designation id foreign key
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    field: 'designation_id',
  })
  declare designationId?: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'last_login_at',
  })
  declare lastLoginAt?: Date;

  @BelongsToMany(() => SysRole, {
    through: () => SysUserRole,
    foreignKey: 'user_id',
    otherKey: 'role_id',
    as: 'roles',
  })
  declare roles?: SysRole[];

  @BelongsToMany(() => SysModules, {
    through: () => SysModuleToUser,
    foreignKey: 'user_id',
    otherKey: 'module_id',
    as: 'modules',
  })
  declare modules?: SysModules[];

  @BelongsToMany(() => SysPermission, {
    through: () => SysUserPermission,
    foreignKey: 'user_id',
    otherKey: 'permission_id',
    as: 'permissions',
  })
  declare permissions?: SysPermission[];

  @HasMany(() => SysUserToken, 'userId')
  declare tokens?: SysUserToken[];

  // Direct access to pivot table records
  @HasMany(() => SysUserPermission, 'userId')
  declare userPermissions?: SysUserPermission[];

  @BelongsToMany(() => SysCompany, {
    through: () => SysUserCompany,
    foreignKey: 'user_id',
    otherKey: 'company_id',
    as: 'companies',
  })
  declare companies?: SysCompany[];

  @HasMany(() => SysUserCompany, 'userId')
  declare userCompanies?: SysUserCompany[];

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  declare firstName?: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  declare lastName?: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  declare username?: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
  })
  declare phone?: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  })
  declare isSuperUser?: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: true,
  })
  declare isActive?: boolean;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  declare passwordHash?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare refreshToken?: string | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'last_logout_at',
  })
  declare lastLogoutAt?: Date | null;

  @ForeignKey(() => SysOrganization)
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    field: 'org_id',
    comment: 'Tenant organization id. Null for super admins.',
  })
  declare orgId?: number;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'org_uuid',
  })
  declare orgUuid?: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: false,
    field: 'is_org_admin',
    comment: 'True if user is the administrator of the tenant organization',
  })
  declare isOrgAdmin?: boolean;

  @BelongsTo(() => SysOrganization, 'org_id')
  declare organization?: SysOrganization;

  @HasMany(() => SysUserFeatureOverride, 'user_id')
  declare featureOverrides?: SysUserFeatureOverride[];

  // Helper method to check if refresh token is valid
  isRefreshTokenValid(): boolean {
    if (
      !this.refreshToken ||
      !this.refreshTokenExpiresAt
    ) {
      return false;
    }
    return (
      new Date() < this.refreshTokenExpiresAt
    );
  }

  @HasMany(() => ProcurementRfq, { foreignKey: 'added_by_id', sourceKey: 'id', as: 'procurementRfqs' }) declare procurementRfqs?: ProcurementRfq[];
  @HasMany(() => ProcurementAssetRfq, { foreignKey: 'added_by_id', sourceKey: 'id', as: 'procurementAssetRfqs' }) declare procurementAssetRfqs?: ProcurementAssetRfq[];
  @HasMany(() => ProcurementMaterialRequisition, { foreignKey: 'added_by_id', sourceKey: 'id', as: 'procurementMaterialRequisitions' }) declare procurementMaterialRequisitions?: ProcurementMaterialRequisition[];
  @HasMany(() => ProcurementAssetRequisition, { foreignKey: 'added_by_id', sourceKey: 'id', as: 'procurementAssetRequisitions' }) declare procurementAssetRequisitions?: ProcurementAssetRequisition[];
  @HasMany(() => ProcurementPurchaseOrder, { foreignKey: 'added_by_id', sourceKey: 'id', as: 'procurementPurchaseOrders' }) declare procurementPurchaseOrders?: ProcurementPurchaseOrder[];
  @HasMany(() => ProcurementAssetPurchaseOrder, { foreignKey: 'added_by_id', sourceKey: 'id', as: 'procurementAssetPurchaseOrders' }) declare procurementAssetPurchaseOrders?: ProcurementAssetPurchaseOrder[];
  @HasMany(() => ProcurementGrn, { foreignKey: 'added_by_id', sourceKey: 'id', as: 'procurementGrns' }) declare procurementGrns?: ProcurementGrn[];
  @HasMany(() => ProcurementPurchaseBill, { foreignKey: 'added_by_id', sourceKey: 'id', as: 'procurementPurchaseBills' }) declare procurementPurchaseBills?: ProcurementPurchaseBill[];
  @HasMany(() => ProcurementAssetGrn, { foreignKey: 'added_by_id', sourceKey: 'id', as: 'procurementAssetGrns' }) declare procurementAssetGrns?: ProcurementAssetGrn[];
  @HasMany(() => ProcurementAssetPurchaseBill, { foreignKey: 'added_by_id', sourceKey: 'id', as: 'procurementAssetPurchaseBills' }) declare procurementAssetPurchaseBills?: ProcurementAssetPurchaseBill[];
  @HasMany(() => ProcurementBoq, { foreignKey: 'responsible_user_id', sourceKey: 'id', as: 'responsibleProcurementBoqs' }) declare responsibleProcurementBoqs?: ProcurementBoq[];
  @HasMany(() => ProcurementBoq, { foreignKey: 'added_by_id', sourceKey: 'id', as: 'createdProcurementBoqs' }) declare createdProcurementBoqs?: ProcurementBoq[];
  @HasMany(() => ProcurementHireOrder, { foreignKey: 'added_by_id', sourceKey: 'id', as: 'createdEquipmentHireOrders' }) declare createdEquipmentHireOrders?: ProcurementHireOrder[];
  @HasMany(() => ProcurementHireIn, { foreignKey: 'received_by_id', sourceKey: 'id', as: 'equipmentHireIns' }) declare equipmentHireIns?: ProcurementHireIn[];
  @HasMany(() => ProcurementHireOut, { foreignKey: 'returned_by_id', sourceKey: 'id', as: 'equipmentHireOuts' }) declare equipmentHireOuts?: ProcurementHireOut[];
  @HasMany(() => ProcurementHireBill, { foreignKey: 'added_by_id', sourceKey: 'id', as: 'equipmentHireBills' }) declare equipmentHireBills?: ProcurementHireBill[];
  @HasMany(() => ProcurementMaterialIssue, { foreignKey: 'issued_by_id', sourceKey: 'id', as: 'procurementMaterialIssues' }) declare procurementMaterialIssues?: ProcurementMaterialIssue[];
  @HasMany(() => ProcurementMaterialIssue, { foreignKey: 'added_by_id', sourceKey: 'id', as: 'createdProcurementMaterialIssues' }) declare createdProcurementMaterialIssues?: ProcurementMaterialIssue[];
}
