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
import { Quotation } from '../quatation/pr_quotation.model';
import { BillingCategory } from './pr_category.model';
import type {
  BillingSubCategoryAttributes,
  BillingSubCategoryCreationAttributes,
} from 'src/database/types/billingsubcategory.types';
import { WorkOrder } from './work-order/pr_work_order.model';

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
    type: DataType.UUID,
    allowNull: true,
  })
  declare categoryId?: string;

  @BelongsTo(() => BillingCategory, {
    foreignKey: 'categoryId',
    targetKey: 'uuid',
    as: 'category',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  declare category?: BillingCategory;

  @HasMany(() => Quotation, {
    foreignKey: 'subCategoryId',
    sourceKey: 'uuid',
    as: 'quotations',
  })
  declare quotations?: Quotation[];
  @HasMany(() => WorkOrder, {
    foreignKey: 'subCategoryId',
    sourceKey: 'uuid',
    as: 'workOrders',
  })
  declare workOrders?: WorkOrder[];
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
