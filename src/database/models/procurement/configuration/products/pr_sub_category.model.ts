/* eslint-disable prettier/prettier */

import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import type {
  ProcurementSubCategoryAttributes,
  ProcurementSubCategoryCreationAttributes,
  ProcurementSubCategoryUpdateAttributes,
} from 'src/database/types/procurementsubcategory.types';
import { Category } from './pr_category.model';
import { ProcurementItemEntry } from './pr_item_entry.model';

@Table({
  tableName: 'pr_sub_category',
  timestamps: true,
  paranoid: true,
  underscored: false,
})
export class ProcurementSubCategory
  extends BaseModel<
    ProcurementSubCategoryUpdateAttributes,
    ProcurementSubCategoryCreationAttributes
  >
  implements ProcurementSubCategoryAttributes
{
  @ForeignKey(() => Category)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare categoryId: string;

  @BelongsTo(() => Category, {
    foreignKey: 'categoryId',
    targetKey: 'uuid',
    as: 'category',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  declare category?: Category;

  @HasMany(() => ProcurementItemEntry, {
    foreignKey: 'sub_category_id',
    sourceKey: 'uuid',
    as: 'itemEntries',
  })
  declare itemEntries?: ProcurementItemEntry[];

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: true,
  })
  declare code: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare name: string;

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
