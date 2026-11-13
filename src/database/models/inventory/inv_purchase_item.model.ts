import { Column, DataType, Table, PrimaryKey, Default, BelongsTo, ForeignKey, Index } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { InvPurchase } from './inv_purchase.model';
import { InvItem } from './inv_item.model';

import type { InvPurchaseItemAttributes, InvPurchaseItemCreationAttributes } from '../../types/invpurchaseitem.types';

@Table({
  tableName: 'inv_purchase_items',
  timestamps: true,
  paranoid: true,
})
export class InvPurchaseItem extends BaseModel<InvPurchaseItemAttributes, InvPurchaseItemCreationAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, allowNull: false, unique: true })
  declare id: any;

  @ForeignKey(() => InvPurchase)
  @Column({ type: DataType.UUID, allowNull: false })
  purchase_id: string;

  @BelongsTo(() => InvPurchase, { foreignKey: 'purchase_id', as: 'purchase', onDelete: 'CASCADE' })
  declare purchase?: InvPurchase;

  @ForeignKey(() => InvItem)
  @Column({ type: DataType.UUID, allowNull: false })
  item_id: string;

  @BelongsTo(() => InvItem, { foreignKey: 'item_id', as: 'item' })
  declare item?: InvItem;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false })
  quantity: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false })
  rate: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false })
  amount: number;

  @Column({ type: DataType.STRING, allowNull: true, field: 'created_by' })
  declare createdBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'updated_by' })
  declare updatedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'deleted_by' })
  declare deletedBy?: string;

  @Index({ name: 'idx_inv_purchase_item_org_id' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare org_id: string;
}
