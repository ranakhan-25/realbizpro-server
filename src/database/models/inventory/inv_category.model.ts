import { Column, DataType, Table, Index, PrimaryKey, Default, HasMany } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { InvSubCategory } from './inv_sub_category.model';
import { InvItem } from './inv_item.model';

import type { InvCategoryAttributes, InvCategoryCreationAttributes } from '../../types/invcategory.types';

@Table({
  tableName: 'inv_categories',
  timestamps: true,
  paranoid: true,
})
export class InvCategory extends BaseModel<InvCategoryAttributes, InvCategoryCreationAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, allowNull: false, unique: true })
  declare id: any;

  @Index({ name: 'idx_inv_category_code' })
  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  category_code: string;

  @Index({ name: 'idx_inv_category_name' })
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  inventory_cog_id?: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  inventory_coa_id?: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  consumption_cog_id?: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  consumption_coa_id?: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  created_by?: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  updated_by?: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  deleted_by?: number;

  @HasMany(() => InvSubCategory, { foreignKey: 'category_id', as: 'sub_categories' })
  declare sub_categories?: InvSubCategory[];

  @HasMany(() => InvItem, { foreignKey: 'category_id', as: 'items' })
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

