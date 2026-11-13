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

import type { InvStockBalanceAttributes, InvStockBalanceCreationAttributes } from '../../types/invstockbalance.types';

@Table({
  tableName: 'inv_stock_balances',
  timestamps: true,
  paranoid: true,
  indexes: [
    {
      name: 'idx_inv_stock_balances_org_wh_item',
      unique: true,
      fields: ['org_id', 'warehouse_id', 'item_id'],
      where: {
        deleted_at: null,
      },
    },
  ],
})
export class InvStockBalance extends BaseModel<InvStockBalanceAttributes, InvStockBalanceCreationAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, allowNull: false, unique: true })
  declare id: any;

  @Index({ name: 'idx_stock_balance_org_id' })
  @Column({ type: DataType.STRING, allowNull: false })
  declare org_id: string;

  @ForeignKey(() => InvWarehouse)
  @Index({ name: 'idx_stock_balance_warehouse_id' })
  @Column({ type: DataType.BIGINT, allowNull: false })
  declare warehouse_id: number;

  @ForeignKey(() => InvItem)
  @Index({ name: 'idx_stock_balance_item_id' })
  @Column({ type: DataType.UUID, allowNull: false })
  declare item_id: string;

  @Column({ type: DataType.DECIMAL(15, 4), allowNull: false, defaultValue: 0 })
  declare current_qty: number;

  @Column({ type: DataType.DECIMAL(15, 4), allowNull: false, defaultValue: 0 })
  declare reserved_qty: number;

  @Column({ type: DataType.DECIMAL(15, 4), allowNull: false, defaultValue: 0 })
  declare available_qty: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 })
  declare avg_cost: number;

  @Column({ type: DataType.DATE, allowNull: true })
  declare last_movement_at?: Date;

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
