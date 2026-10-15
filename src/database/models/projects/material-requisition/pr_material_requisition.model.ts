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

import { Project } from '../project/pr_project.model';
import { Site } from '../project-site/pr_project_site.model';
import { BillingCategory } from '../billing/pr_category.model';
import { MaterialRequisitionItem } from '../material-requisition-item/pr_material_requisition_item.model';
import type {
  MaterialRequisitionAttributes,
  MaterialRequisitionCreationAttributes,
  MaterialRequisitionUpdateAttributes,
} from 'src/database/types/materialrequisition.types';

export enum MaterialRequisitionStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
}

export enum ApprovalLayerStatus {
  PENDING = 'pending',
  ALL_APPROVALS_COMPLETED = 'all_approvals_completed',
  RASEL_HOSAIN = 'rasel_hosain',
  ADMIN = 'admin',
}

@Table({
  tableName: 'material_requisition',
  timestamps: true,
  paranoid: true,
  underscored: false,
  indexes: [
    {
      name: 'MaterialRequisition_code_idx',
      fields: ['code'],
    },
    {
      name: 'MaterialRequisition_projectId_idx',
      fields: ['projectId'],
    },
    {
      name: 'MaterialRequisition_deletedAt_idx',
      fields: ['deleted_at'],
    },
  ],
})
export class MaterialRequisition
  extends BaseModel<
    MaterialRequisitionUpdateAttributes,
    MaterialRequisitionCreationAttributes
  >
  implements MaterialRequisitionAttributes
{
  // --- Form Fields ---
  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  declare date: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  declare demandDate?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare code: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare ref?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare projectType?: string;

  @ForeignKey(() => Project)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'projectId',
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

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare titleNameOfWork?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare ifTask?: string;

  @ForeignKey(() => Site)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare siteId?: string;

  @BelongsTo(() => Site, {
    foreignKey: 'siteId',
    targetKey: 'uuid',
    as: 'site',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  declare site?: Site;

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

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare note?: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
  })
  declare total: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare attachment?: string;

  // --- List Page / System Fields ---
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare addedById?: string;

  @Column({
    type: DataType.ENUM(
      ...Object.values(ApprovalLayerStatus),
    ),
    allowNull: true,
    defaultValue: ApprovalLayerStatus.PENDING,
  })
  declare approvalLayer: ApprovalLayerStatus;

  @Column({
    type: DataType.ENUM(
      ...Object.values(MaterialRequisitionStatus),
    ),
    allowNull: false,
    defaultValue:
      MaterialRequisitionStatus.PENDING,
  })
  declare status: MaterialRequisitionStatus;

  // --- Audit Fields ---
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

  // relation: ek MaterialRequisition er onek Item (1 : N)
  @HasMany(() => MaterialRequisitionItem, {
    foreignKey: 'materialRequisitionId',
    sourceKey: 'uuid',
    as: 'items',
  })
  declare items?: MaterialRequisitionItem[];
}
