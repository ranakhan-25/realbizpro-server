/* eslint-disable prettier/prettier */

import type {
  InvoiceAttributes,
  InvoiceCreationAttributes,
} from 'src/database/types/invoice.types';

import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Table,
} from 'sequelize-typescript';

import { BaseModel } from 'src/database/base.model';
import { InvoiceItem } from './pr_invoice_item.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { ProjectType } from 'src/database/models/projects/project-type/pr_project_type.model';
import { CustomerAccount } from '../contract/pr_customer_accounts.model';

@Table({
  tableName: 'invoices',
  timestamps: true,
  paranoid: true,
  underscored: false,
})
export class Invoice extends BaseModel<
  InvoiceAttributes,
  InvoiceCreationAttributes
> {
  // ❌ uuid column bad dite hobe

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare code: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  declare date: string;

  @ForeignKey(() => CustomerAccount)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare customerId?: string;

  @BelongsTo(() => CustomerAccount, {
    foreignKey: 'customerId',
    targetKey: 'uuid',
    as: 'customer',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  declare customer?: CustomerAccount;

  @ForeignKey(() => Project)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare projectId?: string;

  @BelongsTo(() => Project, {
    foreignKey: 'projectId',
    targetKey: 'uuid',
    as: 'project',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  declare project?: Project;

  @ForeignKey(() => ProjectType)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare projectTypeId?: string;

  @BelongsTo(() => ProjectType, {
    foreignKey: 'projectTypeId',
    targetKey: 'uuid',
    as: 'projectType',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  declare projectType?: ProjectType;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare grandTotal: number;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare paidAmount: number;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare dueAmount: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare paymentMethod?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare approvalStatus?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare contentBody?: string;

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
    foreignKey: 'invoiceId',
    sourceKey: 'uuid',
    as: 'items',
  })
  declare items?: InvoiceItem[];
}
