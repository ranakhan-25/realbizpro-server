import { BelongsTo, Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import { BaseModel } from '../../../base.model';
import { ProcurementHireIn } from './pr_hire_in.model';
import { ProcurementHireOrderItem } from './pr_hire_order_item.model';
import type { ProcurementHireInItemAttributes, ProcurementHireInItemCreationAttributes } from '../../../types/procurementhireinitem.types';

@Table({ tableName: 'pr_hire_in_items', timestamps: true, paranoid: true, underscored: true })
export class ProcurementHireInItem extends BaseModel<ProcurementHireInItemAttributes, ProcurementHireInItemCreationAttributes> {
  @ForeignKey(() => ProcurementHireIn) @Column({ type: DataType.UUID, allowNull: false }) declare hire_in_id: string;
  @BelongsTo(() => ProcurementHireIn, { foreignKey: 'hire_in_id', targetKey: 'uuid', as: 'hireIn', onDelete: 'CASCADE' }) declare hireIn?: ProcurementHireIn;
  @ForeignKey(() => ProcurementHireOrderItem) @Column({ type: DataType.UUID, allowNull: false }) declare hire_order_item_id: string;
  @BelongsTo(() => ProcurementHireOrderItem, { foreignKey: 'hire_order_item_id', targetKey: 'uuid', as: 'hireOrderItem' }) declare hireOrderItem?: ProcurementHireOrderItem;
  @Column({ type: DataType.DECIMAL(15, 3), allowNull: false }) declare quantity: number;
  @Column({ type: DataType.STRING(40), allowNull: false, defaultValue: 'good' }) declare condition: string;
  @Column({ type: DataType.TEXT, allowNull: true }) declare remarks?: string;
}
