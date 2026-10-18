/* eslint-disable prettier/prettier */

import type {
  ItemAttributes,
  ItemCreationAttributes,
} from 'src/database/types/item.types';

import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Table,
} from 'sequelize-typescript';

import { BaseModel } from 'src/database/base.model';
import { BillingCategory } from './pr_category.model';
import { BillingSubCategory } from './pr_sub_category.model';
import { InvoiceItem } from './pr_invoice_item.model';

@Table({
  tableName: 'items',
  timestamps: true,
  paranoid: true,
  underscored: false,
})
export class Item extends BaseModel<
  ItemAttributes,
  ItemCreationAttributes
> {
  // ❌ uuid column bad dite hobe

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare itemName: string;

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

  @ForeignKey(() => BillingSubCategory)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare subCategoryId?: string;

  @BelongsTo(() => BillingSubCategory, {
    foreignKey: 'subCategoryId',
    targetKey: 'uuid',
    as: 'subCategory',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  declare subCategory?: BillingSubCategory;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare brand?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 'Nos',
  })
  declare unit: string;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare purchasePrice: number;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare salePrice: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare image?: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  declare isActive: boolean;

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

  @HasMany(() => InvoiceItem, {
    foreignKey: 'itemId',
    sourceKey: 'uuid',
    as: 'invoiceItems',
  })
  declare invoiceItems?: InvoiceItem[];
}
