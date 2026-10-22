/* eslint-disable prettier/prettier */

import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import { Category } from './pr_category.model';
import {
  CategoryAccountMappingAttributes,
  CategoryAccountMappingCreationAttributes,
  CategoryAccountMappingUpdateAttributes,
} from 'src/database/types/categoryaccountmapping.types';

// ENUM মডেল ফাইলের ভেতরে রাখা হলো
export enum AccountCreationType {
  CREATE_NEW = 'Create New',
  EXISTING = 'Existing',
}

@Table({
  tableName: 'pr_category_account_mapping',
  timestamps: true,
  paranoid: true,
  underscored: false,
})
export class CategoryAccountMapping
  extends BaseModel<
    CategoryAccountMappingUpdateAttributes,
    CategoryAccountMappingCreationAttributes
  >
  implements CategoryAccountMappingAttributes
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
  })
  declare category?: Category;

  // ---------------- Inventory Account Section ----------------

  @Column({
    type: DataType.ENUM(
      ...Object.values(AccountCreationType),
    ),
    allowNull: false,
    defaultValue: AccountCreationType.CREATE_NEW,
  })
  declare inventoryAccountType: AccountCreationType;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare inventoryAccountGroupCode?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare existingInventoryAccountId?: string;

  // ---------------- Consumption Account Section ----------------

  @Column({
    type: DataType.ENUM(
      ...Object.values(AccountCreationType),
    ), // ENUM ব্যবহার
    allowNull: false,
    defaultValue: AccountCreationType.CREATE_NEW,
  })
  declare consumptionAccountType: AccountCreationType;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare consumptionAccountGroupCode?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare existingConsumptionAccountId?: string;

  // Audit Fields
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
}
