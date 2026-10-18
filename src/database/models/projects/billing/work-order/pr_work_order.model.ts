import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import { Project } from '../../project/pr_project.model';
import { Site } from '../../project-site/pr_project_site.model';
import { ProjectType } from '../../project-type/pr_project_type.model';
import { CustomerAccount } from '../../contract/pr_customer_accounts.model';
import { BillingCategory } from '../pr_category.model';
import { BillingSubCategory } from '../pr_sub_category.model';

import type { WorkOrderAttributes, WorkOrderCreationAttributes } from '../../../../types/workorder.types';

@Table({ tableName: 'pr_work_orders', timestamps: true, paranoid: true })
export class WorkOrder extends BaseModel<WorkOrderAttributes, WorkOrderCreationAttributes> {
  @Column({ type: DataType.STRING(100), allowNull: false, unique: true })
  declare code: string;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  declare date: string;

  @ForeignKey(() => CustomerAccount)
  @Column({ type: DataType.UUID, allowNull: true })
  declare customerId?: string;

  @BelongsTo(() => CustomerAccount, { foreignKey: 'customerId', targetKey: 'uuid', as: 'customer', onDelete: 'SET NULL' })
  declare customer?: CustomerAccount;

  @Column({ type: DataType.STRING, allowNull: true })
  declare clientOrderNo?: string;

  @ForeignKey(() => ProjectType)
  @Column({ type: DataType.UUID, allowNull: true })
  declare projectTypeId?: string;

  @BelongsTo(() => ProjectType, { foreignKey: 'projectTypeId', targetKey: 'uuid', as: 'projectType', onDelete: 'SET NULL' })
  declare projectType?: ProjectType;

  @ForeignKey(() => Project)
  @Column({ type: DataType.UUID, allowNull: false })
  declare projectId: string;

  @BelongsTo(() => Project, { foreignKey: 'projectId', targetKey: 'uuid', as: 'project', onDelete: 'CASCADE' })
  declare project?: Project;

  @ForeignKey(() => Site)
  @Column({ type: DataType.UUID, allowNull: true })
  declare siteId?: string;

  @BelongsTo(() => Site, { foreignKey: 'siteId', targetKey: 'uuid', as: 'site', onDelete: 'SET NULL' })
  declare site?: Site;

  @Column({ type: DataType.STRING, allowNull: true })
  declare poNo?: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare attachment?: string;

  @ForeignKey(() => BillingCategory)
  @Column({ type: DataType.UUID, allowNull: true })
  declare categoryId?: string;

  @BelongsTo(() => BillingCategory, { foreignKey: 'categoryId', targetKey: 'uuid', as: 'category', onDelete: 'SET NULL' })
  declare category?: BillingCategory;

  @ForeignKey(() => BillingSubCategory)
  @Column({ type: DataType.UUID, allowNull: true })
  declare subCategoryId?: string;

  @BelongsTo(() => BillingSubCategory, { foreignKey: 'subCategoryId', targetKey: 'uuid', as: 'subCategory', onDelete: 'SET NULL' })
  declare subCategory?: BillingSubCategory;

  @Column({ type: DataType.JSONB, allowNull: false, defaultValue: [] })
  declare items: Array<Record<string, unknown>>;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 })
  declare subtotal: number;

  @Column({ type: DataType.DECIMAL(7, 2), allowNull: false, defaultValue: 0 })
  declare vatPercent: number;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  declare vatInclude: boolean;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 })
  declare vatAmount: number;

  @Column({ type: DataType.DECIMAL(7, 2), allowNull: false, defaultValue: 0 })
  declare aitPercent: number;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  declare aitInclude: boolean;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 })
  declare aitAmount: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 })
  declare grandTotal: number;

  @Column({ type: DataType.STRING, allowNull: true })
  declare createdBy?: string;
}
