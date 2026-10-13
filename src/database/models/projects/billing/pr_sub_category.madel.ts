/* eslint-disable prettier/prettier */

import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';

import { BaseModel } from 'src/database/base.model';

import type {
  BillingSubCategoryAttributes,
  BillingSubCategoryCreationAttributes,
} from 'src/database/types/billingsubcategory.types';
import { BillingCategory } from './pr_category.model';

export enum SubCategoryType {
  PRODUCT = 'Product',
  SERVICE = 'Service',
}

@Table({
  tableName: 'sub_categories',
  timestamps: true,
  paranoid: true,
  underscored: false,
})
export class BillingSubCategory
  extends BaseModel<
    BillingSubCategoryAttributes,
    BillingSubCategoryCreationAttributes
  >
  implements BillingSubCategoryAttributes
{
  @Column({
    type: DataType.ENUM(
      ...Object.values(SubCategoryType),
    ),
    allowNull: false,
  })
  declare type: SubCategoryType;

  @ForeignKey(() => BillingCategory)
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  declare categoryId?: number;

  @BelongsTo(() => BillingCategory, {
    foreignKey: 'categoryId',
    targetKey: 'id',
  })
  declare category?: BillingCategory;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare code: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description?: string;

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
