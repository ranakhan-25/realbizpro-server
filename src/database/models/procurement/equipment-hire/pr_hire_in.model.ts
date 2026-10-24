import { BelongsTo, Column, DataType, ForeignKey, HasMany, Table } from 'sequelize-typescript';
import { BaseModel } from '../../../base.model';
import { ProcurementHireOrder } from './pr_hire_order.model';
import { SysUser } from '../../system/sys_user.model';
import { ProcurementHireInItem } from './pr_hire_in_item.model';
import type { ProcurementHireInAttributes, ProcurementHireInCreationAttributes } from '../../../types/procurementhirein.types';

@Table({ tableName: 'pr_hire_in', timestamps: true, paranoid: true, underscored: true })
export class ProcurementHireIn extends BaseModel<ProcurementHireInAttributes, ProcurementHireInCreationAttributes> {
  @Column({ type: DataType.STRING(50), allowNull: false, unique: true }) declare hire_in_no: string;
  @ForeignKey(() => ProcurementHireOrder) @Column({ type: DataType.UUID, allowNull: false }) declare hire_order_id: string;
  @BelongsTo(() => ProcurementHireOrder, { foreignKey: 'hire_order_id', targetKey: 'uuid', as: 'hireOrder' }) declare hireOrder?: ProcurementHireOrder;
  @Column({ type: DataType.DATEONLY, allowNull: false }) declare received_date: string;
  @Column({ type: DataType.STRING(40), allowNull: false, defaultValue: 'received' }) declare status: string;
  @Column({ type: DataType.TEXT, allowNull: true }) declare notes?: string;
  @ForeignKey(() => SysUser) @Column({ type: DataType.BIGINT, allowNull: true }) declare received_by_id?: number;
  @BelongsTo(() => SysUser, { foreignKey: 'received_by_id', targetKey: 'id', as: 'receivedBy' }) declare receivedBy?: SysUser;
  @HasMany(() => ProcurementHireInItem, { foreignKey: 'hire_in_id', sourceKey: 'uuid', as: 'items' }) declare items?: ProcurementHireInItem[];
  @Column({ type: DataType.STRING, allowNull: true }) declare createdBy?: string;
  @Column({ type: DataType.STRING, allowNull: true }) declare updatedBy?: string;
  @Column({ type: DataType.STRING, allowNull: true }) declare deletedBy?: string;
}
