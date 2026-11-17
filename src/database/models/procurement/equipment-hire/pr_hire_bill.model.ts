import { SysOrganization } from 'src/database/models/system/sys_organization.model';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from '../../../base.model';
import { ProcurementHireOrder } from './pr_hire_order.model';
import { Project } from '../../projects/project/pr_project.model';
import { SupplierAccounts } from '../../projects/contract/pr_supplier_accounts.model';
import { SysUser } from '../../system/sys_user.model';
import { ProcurementHireBillItem } from './pr_hire_bill_item.model';
import type { ProcurementHireBillAttributes, ProcurementHireBillCreationAttributes } from '../../../types/procurementhirebill.types';

@Table({
  tableName: 'pr_hire_bill',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class ProcurementHireBill extends BaseModel<ProcurementHireBillAttributes, ProcurementHireBillCreationAttributes> {
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
  })
  declare bill_no: string;
  @ForeignKey(() => ProcurementHireOrder)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare hire_order_id: string;
  @BelongsTo(() => ProcurementHireOrder, {
    foreignKey: 'hire_order_id',
    targetKey: 'uuid',
    as: 'hireOrder',
  })
  declare hireOrder?: ProcurementHireOrder;
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
  declare period_from: string;
  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  declare period_to: string;
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
  declare discount: number;
  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare carriage: number;
  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare net_amount: number;
  @Column({
    type: DataType.STRING(40),
    allowNull: false,
    defaultValue: 'pending',
  })
  declare status: string;
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare notes?: string;
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
  @HasMany(() => ProcurementHireBillItem, {
    foreignKey: 'bill_id',
    sourceKey: 'uuid',
    as: 'items',
  })
  declare items?: ProcurementHireBillItem[];
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


  @ForeignKey(() => SysOrganization)
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    field: 'org_id',
    defaultValue: null,
  })
  declare orgId?: number | null;

  @BelongsTo(() => SysOrganization, {
    foreignKey: 'orgId',
    targetKey: 'id',
    as: 'organization',
  })
  declare organization?: SysOrganization;

}
