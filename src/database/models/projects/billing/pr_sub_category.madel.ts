/* eslint-disable prettier/prettier */

import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import { BaseModel } from 'src/database/base.model';
import type {
  BillingSubCategoryAttributes,
  BillingSubCategoryCreationAttributes,
} from 'src/database/types/billingsubcategory.types';

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

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare categoryId?: string;

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
