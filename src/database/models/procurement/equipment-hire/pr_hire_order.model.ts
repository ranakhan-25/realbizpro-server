import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from '../../../base.model';
import { Project } from '../../projects/project/pr_project.model';
import { Site } from '../../projects/project-site/pr_project_site.model';
import { SupplierAccounts } from '../../projects/contract/pr_supplier_accounts.model';
import { SysUser } from '../../system/sys_user.model';
import { ProcurementAssetRequisition } from '../requisition/pr_asset_requisition.model';
import { ProcurementHireOrderItem } from './pr_hire_order_item.model';
import { ProcurementHireIn } from './pr_hire_in.model';
import { ProcurementHireOut } from './pr_hire_out.model';
import { ProcurementHireBill } from './pr_hire_bill.model';
import type { ProcurementHireOrderAttributes, ProcurementHireOrderCreationAttributes } from '../../../types/procurementhireorder.types';

export enum HireOrderMode {
  REQUISITION_BASED = 'requisition_based',
  FREE_HIRE = 'free_hire',
}
export enum HireOrderStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  CLOSED = 'closed',
  CANCELLED = 'cancelled',
}
@Table({
  tableName: 'pr_hire_order',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class ProcurementHireOrder extends BaseModel<ProcurementHireOrderAttributes, ProcurementHireOrderCreationAttributes> {
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
  })
  declare hire_no: string;
  @Column({
    type: DataType.ENUM(
      ...Object.values(HireOrderMode),
    ),
    allowNull: false,
  })
  declare hire_mode: HireOrderMode;
  @ForeignKey(() => ProcurementAssetRequisition)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare requisition_id?: string;
  @BelongsTo(() => ProcurementAssetRequisition, {
    foreignKey: 'requisition_id',
    targetKey: 'uuid',
    as: 'requisition',
  })
  declare requisition?: ProcurementAssetRequisition;
  @ForeignKey(() => Project)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare project_id: string;
  @BelongsTo(() => Project, {
    foreignKey: 'project_id',
    targetKey: 'uuid',
    as: 'project',
  })
  declare project?: Project;
  @ForeignKey(() => Site)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare site_id?: string;
  @BelongsTo(() => Site, {
    foreignKey: 'site_id',
    targetKey: 'uuid',
    as: 'site',
  })
  declare site?: Site;
  @ForeignKey(() => SupplierAccounts)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare vendor_id: string;
  @BelongsTo(() => SupplierAccounts, {
    foreignKey: 'vendor_id',
    targetKey: 'uuid',
    as: 'vendor',
  })
  declare vendor?: SupplierAccounts;
  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  declare hire_from: string;
  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  declare hire_to?: string;
  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare shipping_cost: number;
  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare order_discount: number;
  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare subtotal: number;
  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare vat_total: number;
  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare ait_tds_total: number;
  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare grand_total: number;
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare notes?: string;
  @Column({
    type: DataType.ENUM(
      ...Object.values(HireOrderStatus),
    ),
    allowNull: false,
    defaultValue: HireOrderStatus.DRAFT,
  })
  declare status: HireOrderStatus;
  @ForeignKey(() => SysUser)
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  declare added_by_id?: number;
  @BelongsTo(() => SysUser, {
    foreignKey: 'added_by_id',
    targetKey: 'id',
    as: 'addedBy',
  })
  declare addedBy?: SysUser;
  @HasMany(() => ProcurementHireOrderItem, {
    foreignKey: 'hire_order_id',
    sourceKey: 'uuid',
    as: 'items',
  })
  declare items?: ProcurementHireOrderItem[];
  @HasMany(() => ProcurementHireIn, {
    foreignKey: 'hire_order_id',
    sourceKey: 'uuid',
    as: 'hireIns',
  })
  declare hireIns?: ProcurementHireIn[];
  @HasMany(() => ProcurementHireOut, {
    foreignKey: 'hire_order_id',
    sourceKey: 'uuid',
    as: 'hireOuts',
  })
  declare hireOuts?: ProcurementHireOut[];
  @HasMany(() => ProcurementHireBill, {
    foreignKey: 'hire_order_id',
    sourceKey: 'uuid',
    as: 'bills',
  })
  declare bills?: ProcurementHireBill[];
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare createdBy?: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare updatedBy?: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare deletedBy?: string;
}
