/* eslint-disable prettier/prettier */

import {
  Column,
  DataType,
  HasMany,
  Table,
} from 'sequelize-typescript';
import { MaterialRequisition } from '../material-requisition/pr_material_requisition.model';
import { Quotation } from '../quatation/pr_quotation.model';
import { BillingSubCategory } from './pr_sub_category.model';

import { BaseModel } from 'src/database/base.model';
import type {
  BillingCategoryAttributes,
  BillingCategoryCreationAttributes,
} from 'src/database/types/billingcategory.types';
import { WorkOrder } from './work-order/pr_work_order.model';

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
    type: DataType.ENUM(
      ...Object.values(CategoryType),
    ),
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

  @HasMany(() => MaterialRequisition, {
    foreignKey: 'categoryId',
    sourceKey: 'uuid',
    as: 'materialRequisitions',
  })
  declare materialRequisitions?: MaterialRequisition[];

  @HasMany(() => BillingSubCategory, {
    foreignKey: 'categoryId',
    sourceKey: 'uuid',
    as: 'subCategories',
  })
  declare subCategories?: BillingSubCategory[];

  @HasMany(() => Quotation, {
    foreignKey: 'categoryId',
    sourceKey: 'uuid',
    as: 'quotations',
  })
  declare quotations?: Quotation[];

  @HasMany(() => WorkOrder, {
    foreignKey: 'categoryId',
    sourceKey: 'uuid',
    as: 'workOrders',
  })
  declare workOrders?: WorkOrder[];

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
