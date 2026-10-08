/* eslint-disable prettier/prettier */

import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import { BaseModel } from 'src/database/base.model';
import type { BillingCategoryAttributes, BillingCategoryCreationAttributes } from 'src/database/types/billingcategory.types';


export enum CategoryType {
  PRODUCT = 'Product',
  SERVICE = 'Service',
}

@Table({
  tableName: 'categories',
  timestamps: true,
  paranoid: true,
  underscored: false,
})
export class BillingCategory
  extends BaseModel<
    BillingCategoryAttributes,
    BillingCategoryCreationAttributes
  >
  implements BillingCategoryAttributes
{
  @Column({
    type: DataType.ENUM(...Object.values(CategoryType)),
    allowNull: false,
  })
  declare type: CategoryType;

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