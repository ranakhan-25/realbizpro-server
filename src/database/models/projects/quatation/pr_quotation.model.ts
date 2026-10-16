/* eslint-disable prettier/prettier */

import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';

import { BaseModel } from '../../../base.model';
import { BillingCategory } from '../billing/pr_category.model';
import { BillingSubCategory } from '../billing/pr_sub_category.model';

import {
  QuotationAttributes,
  QuotationCreationAttributes,
  QuotationUpdateAttributes,
} from 'src/database/types/quotation.types';

@Table({
  tableName: 'pr_quotation',
  timestamps: true,
  paranoid: true,
  underscored: false,
})
export class Quotation
  extends BaseModel<
    QuotationUpdateAttributes,
    QuotationCreationAttributes
  >
  implements QuotationAttributes
{
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  declare uuid: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare uid?: string; // e.g. QU000004

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  declare date: Date;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare customer?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare customerId?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare code: string; // Order Code e.g. QU000005

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare projectType?: string; // Commercial / Residential

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare project?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare projectId?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare site?: string;

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
    type: DataType.JSONB,
    allowNull: false,
    defaultValue: [],
  })
  declare items: Array<{
    itemName: string;
    unit: string;
    quantity: number;
    rate: number;
    details: string;
    image: string;
    amount: number;
  }>;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare attachment?: string; // file path / url

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare contentBody?: string; // rich text content

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare employeeName?: string;

  @Column({
    type: DataType.DECIMAL(14, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare grandTotal: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: 'Pending',
  })
  declare approveStatus?: string; // Pending / Approved / Rejected

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare addedBy?: string;

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