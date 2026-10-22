/* eslint-disable prettier/prettier */

import {
  Column,
  DataType,
  HasMany,
  HasOne,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import {
  CategoryAttributes,
  CategoryCreationAttributes,
  CategoryUpdateAttributes,
} from 'src/database/types/category.types';
import { CategoryAccountMapping } from './pr_category_account_mapping.model';
import { ProcurementSubCategory } from './pr_sub_category.model';
import { ProcurementItemEntry } from './pr_item_entry.model';

@Table({
  tableName: 'pr_category',
  timestamps: true,
  paranoid: true,
  underscored: false,
})
export class Category
  extends BaseModel<
    CategoryUpdateAttributes,
    CategoryCreationAttributes
  >
  implements CategoryAttributes
{
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare uid?: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  declare type: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
  })
  declare code: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @HasOne(() => CategoryAccountMapping, {
    foreignKey: 'categoryId',
    sourceKey: 'uuid',
    as: 'accountMapping',
  })
  declare accountMapping?: CategoryAccountMapping;

  @HasMany(() => ProcurementSubCategory, {
    foreignKey: 'categoryId',
    sourceKey: 'uuid',
    as: 'subCategories',
  })
  declare subCategories?: ProcurementSubCategory[];

  @HasMany(() => ProcurementItemEntry, {
    foreignKey: 'category_id',
    sourceKey: 'uuid',
    as: 'itemEntries',
  })
  declare itemEntries?: ProcurementItemEntry[];

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare addedById?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare createdBy?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare updatedBy?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare deletedBy?: string;
}
