import { Column, DataType, Table, Index, PrimaryKey, Default, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { InvCategory } from './inv_category.model';
import { InvSubCategory } from './inv_sub_category.model';
import { InvBrand } from './inv_brand.model';
import { InvUnit } from './inv_unit.model';

import type { InvItemAttributes, InvItemCreationAttributes } from '../../types/invitem.types';

@Table({
  tableName: 'inv_items',
  timestamps: true,
  paranoid: true,
})
export class InvItem extends BaseModel<InvItemAttributes, InvItemCreationAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, allowNull: false, unique: true })
  declare id: any;

  @Index({ name: 'idx_inv_item_code' })
  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  item_code: string;

  @Index({ name: 'idx_inv_item_name' })
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: true })
  type?: string;

  @Column({ type: DataType.DECIMAL(15, 2), defaultValue: 0 })
  purchase_price: number;

  @Column({ type: DataType.DECIMAL(15, 2), defaultValue: 0 })
  sale_price: number;

  @ForeignKey(() => InvCategory)
  @Index({ name: 'idx_inv_item_category' })
  @Column({ type: DataType.UUID, allowNull: false })
  category_id: any;

  @BelongsTo(() => InvCategory)
  category: InvCategory;

  @ForeignKey(() => InvSubCategory)
  @Column({ type: DataType.UUID, allowNull: true })
  sub_category_id?: any;

  @BelongsTo(() => InvSubCategory)
  sub_category: InvSubCategory;

  @ForeignKey(() => InvBrand)
  @Column({ type: DataType.UUID, allowNull: true })
  brand_id?: any;

  @BelongsTo(() => InvBrand)
  brand: InvBrand;

  @ForeignKey(() => InvUnit)
  @Column({ type: DataType.UUID, allowNull: false })
  unit_id: any;

  @BelongsTo(() => InvUnit)
  unit: InvUnit;

  @Column({ type: DataType.INTEGER, allowNull: true })
  created_by?: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  updated_by?: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  deleted_by?: number;
}
