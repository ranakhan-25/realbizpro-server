import { Column, DataType, Table, Index, PrimaryKey, Default, BelongsTo, ForeignKey, HasMany } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { InvCategory } from './inv_category.model';
import { InvItem } from './inv_item.model';

import type { InvSubCategoryAttributes, InvSubCategoryCreationAttributes } from '../../types/invsubcategory.types';

@Table({
  tableName: 'inv_sub_categories',
  timestamps: true,
  paranoid: true,
})
export class InvSubCategory extends BaseModel<InvSubCategoryAttributes, InvSubCategoryCreationAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, allowNull: false, unique: true })
  declare id: any;

  @Index({ name: 'idx_inv_sub_category_code' })
  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  sub_category_code: string;

  @Index({ name: 'idx_inv_sub_category_name' })
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @ForeignKey(() => InvCategory)
  @Column({ type: DataType.UUID, allowNull: false })
  category_id: any;

  @BelongsTo(() => InvCategory, { foreignKey: 'category_id', as: 'category' })
  declare category?: InvCategory;

  @Column({ type: DataType.INTEGER, allowNull: true })
  created_by?: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  updated_by?: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  deleted_by?: number;

  @HasMany(() => InvItem, { foreignKey: 'sub_category_id', as: 'items' })
  declare items?: InvItem[];

  @Column({ type: DataType.STRING, allowNull: true, field: 'created_by' })
  declare createdBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'updated_by' })
  declare updatedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'deleted_by' })
  declare deletedBy?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare org_id?: string;
}

