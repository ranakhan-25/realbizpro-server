import { Column, DataType, Table, PrimaryKey, Default, ForeignKey, BelongsTo, Index } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { InvMaterialUsage } from './inv_material_usage.model';
import { InvItem } from './inv_item.model';

import type { InvMaterialUsageItemAttributes, InvMaterialUsageItemCreationAttributes } from '../../types/invmaterialusageitem.types';

@Table({
  tableName: 'inv_material_usage_items',
  timestamps: true,
  paranoid: true,
})
export class InvMaterialUsageItem extends BaseModel<InvMaterialUsageItemAttributes, InvMaterialUsageItemCreationAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, allowNull: false, unique: true })
  declare id: any;

  @ForeignKey(() => InvMaterialUsage)
  @Column({ type: DataType.UUID, allowNull: false })
  usage_id: string;

  @BelongsTo(() => InvMaterialUsage, { foreignKey: 'usage_id', as: 'usage' })
  usage: InvMaterialUsage;

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

  @Index({ name: 'idx_inv_material_usage_item_org_id' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare org_id: string;
}
