import {
  Column,
  DataType,
  Table,
  ForeignKey,
  BelongsTo,
  Index,
  PrimaryKey,
  Default,
} from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { InvWarehouse } from './warehouse.model';
import { InvItem } from './inv_item.model';

import type { InvMovementAttributes, InvMovementCreationAttributes } from '../../types/invmovement.types';

@Table({
  tableName: 'inv_movements',
  timestamps: true,
  paranoid: true,
})
export class InvMovement extends BaseModel<InvMovementAttributes, InvMovementCreationAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, allowNull: false, unique: true })
  declare id: any;

  @Index({ name: 'idx_inv_movement_org_id' })
  @Column({ type: DataType.STRING, allowNull: false })
  declare org_id: string;

  @Index({ name: 'idx_inv_movement_no' })
  @Column({ type: DataType.STRING(50), allowNull: false })
  declare movement_no: string;

  @Index({ name: 'idx_inv_movement_type' })
  @Column({ type: DataType.STRING(50), allowNull: false })
  declare movement_type: string; // opening, issue, return, transfer, adjustment, consumption

  @Index({ name: 'idx_inv_movement_date' })
  @Column({ type: DataType.DATEONLY, allowNull: false, defaultValue: DataType.NOW })
  declare movement_date: Date;

  @ForeignKey(() => InvItem)
  @Index({ name: 'idx_inv_movement_item_id' })
  @Column({ type: DataType.UUID, allowNull: false })
  declare item_id: string;

  @ForeignKey(() => InvWarehouse)
  @Index({ name: 'idx_inv_movement_warehouse_id' })
  @Column({ type: DataType.BIGINT, allowNull: false })
  declare warehouse_id: number;

  @Column({ type: DataType.BIGINT, allowNull: true })
  declare to_warehouse_id?: number;

  @Column({ type: DataType.DECIMAL(15, 4), allowNull: false, defaultValue: 0 })
  declare quantity: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 })
  declare unit_rate: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 })
  declare total_amount: number;

  @Column({ type: DataType.STRING(50), allowNull: true })
  declare reference_type?: string;

  @Column({ type: DataType.STRING(100), allowNull: true })
  declare reference_id?: string;

  @Column({ type: DataType.STRING(150), allowNull: true })
  declare issued_to?: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare reason?: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare notes?: string;

  @Column({ type: DataType.STRING(500), allowNull: true })
  declare photo_url?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'created_by' })
  declare createdBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'updated_by' })
  declare updatedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'deleted_by' })
  declare deletedBy?: string;

  @BelongsTo(() => InvWarehouse, { foreignKey: 'warehouse_id', as: 'warehouse' })
  declare warehouse?: InvWarehouse;

  @BelongsTo(() => InvItem, { foreignKey: 'item_id', as: 'item' })
  declare item?: InvItem;
}
