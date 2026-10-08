import { Column, DataType, Table, PrimaryKey, Default, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { InvItem } from './inv_item.model';

import type { InvStockTransferAttributes, InvStockTransferCreationAttributes } from '../../types/invstocktransfer.types';

@Table({
  tableName: 'inv_stock_transfers',
  timestamps: true,
  paranoid: true,
})
export class InvStockTransfer extends BaseModel<InvStockTransferAttributes, InvStockTransferCreationAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, allowNull: false, unique: true })
  declare id: any;

  @Column({ type: DataType.DATE, allowNull: false })
  date: Date;

  @Column({ type: DataType.TEXT, allowNull: true })
  note?: string;

  @Column({ type: DataType.STRING, allowNull: false, defaultValue: 'Pending' })
  status: string;

  @Column({ type: DataType.BIGINT, allowNull: true })
  from_project_id?: number;

  @Column({ type: DataType.BIGINT, allowNull: true })
  to_project_id?: number;

  @Column({ type: DataType.BIGINT, allowNull: true })
  from_site_id?: number;

  @Column({ type: DataType.BIGINT, allowNull: true })
  to_site_id?: number;

  @ForeignKey(() => InvItem)
  @Column({ type: DataType.UUID, allowNull: false })
  item_id: string;

  @BelongsTo(() => InvItem, { foreignKey: 'item_id', as: 'item' })
  item: InvItem;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false })
  quantity: number;

  @Column({ type: DataType.STRING, allowNull: true, field: 'created_by' })
  declare createdBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'updated_by' })
  declare updatedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'deleted_by' })
  declare deletedBy?: string;
}
