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

import {
  ServiceWorkRequisitionAttributes,
  ServiceWorkRequisitionCreationAttributes,
  ServiceWorkRequisitionUpdateAttributes,
} from 'src/database/types/serviceworkrequisition.types';
import { ServiceWorkRequisitionItem } from '../service-work-requisition-item/pr_service_work_requisition_item.model';
import { Project } from '../project/pr_project.model';
import { Site } from '../project-site/pr_project_site.model';
import { BillingCategory } from '../billing/pr_category.model';
import { BillingSubCategory } from '../billing/pr_sub_category.model';
import { ProcurementWorkOrder } from '../../procurement/work-order/pr_procurement_work_order.model';
import { SysOrganization } from "src/database/models/system/sys_organization.model";

export enum ServiceWorkRequisitionStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Table({
  tableName: 'service_work_requisitions',
  timestamps: true,
  paranoid: true,
  underscored: false,
})
export class ServiceWorkRequisition
  extends BaseModel<
    ServiceWorkRequisitionUpdateAttributes,
    ServiceWorkRequisitionCreationAttributes
  >
  implements ServiceWorkRequisitionAttributes
{
  // =========================
  // REQUISITION INFO
  // =========================

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  declare requisitionDate: Date;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare requisitionCode: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare projectType?: string;

  // =========================
  // RELATIONS — FK columns
  // =========================

  @ForeignKey(() => Project)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'targetProjectId',
  })
  declare targetProjectId?: string;

  @BelongsTo(() => Project, {
    foreignKey: 'targetProjectId',
    targetKey: 'uuid',
    as: 'project',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  declare project?: Project;

  @ForeignKey(() => BillingCategory)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'titleOrWorkNameId',
  })
  declare titleOrWorkNameId?: string;

  @BelongsTo(() => BillingCategory, {
    foreignKey: 'titleOrWorkNameId',
    targetKey: 'uuid',
    as: 'titleOrWorkName',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  declare titleOrWorkName?: BillingCategory;

  @ForeignKey(() => BillingSubCategory)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'taskSubcategory',
  })
  declare taskSubcategory?: string;

  @BelongsTo(() => BillingSubCategory, {
    foreignKey: 'taskSubcategory',
    targetKey: 'uuid',
    as: 'taskSubcategoryItem',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  declare taskSubcategoryItem?: BillingSubCategory;

  @ForeignKey(() => Site)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'constructionSiteId',
  })
  declare constructionSiteId?: string;

  @BelongsTo(() => Site, {
    foreignKey: 'constructionSiteId',
    targetKey: 'uuid',
    as: 'constructionSite',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  declare constructionSite?: Site;

  // =========================
  // FINANCIALS & ATTACHMENT
  // =========================

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0.0,
  })
  declare subtotalAmount: number;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0.0,
  })
  declare grandTotalPayable: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare supportingAttachment?: string;

  // =========================
  // RELATIONS — HasMany
  // =========================

  @HasMany(() => ServiceWorkRequisitionItem, {
    foreignKey: 'serviceWorkRequisitionId',
    sourceKey: 'uuid',
    onDelete: 'CASCADE',
    as: 'items',
  })
  declare items?: ServiceWorkRequisitionItem[];

  @HasMany(() => ProcurementWorkOrder, { foreignKey: 'requisition_id', sourceKey: 'uuid', as: 'procurementWorkOrders' })
  declare procurementWorkOrders?: ProcurementWorkOrder[];

  // =========================
  // AUDIT
  // =========================

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare addedById?: string;

  @Column({
          field: 'created_by',
          type: DataType.STRING,
          allowNull: true,
        })
  declare createdBy?: string;

  @Column({
          field: 'updated_by',
          type: DataType.STRING,
          allowNull: true,
        })
  declare updatedBy?: string;

  @Column({
          field: 'deleted_by',
          type: DataType.STRING,
          allowNull: true,
        })
  declare deletedBy?: string;

  // =========================
  // STATUS
  // =========================

  @Column({
    type: DataType.ENUM(
      ...Object.values(
        ServiceWorkRequisitionStatus,
      ),
    ),
    allowNull: false,
    defaultValue:
      ServiceWorkRequisitionStatus.PENDING,
  })
  declare status: ServiceWorkRequisitionStatus;
    @ForeignKey(() => SysOrganization)
    @Column({
            type: DataType.BIGINT,
            allowNull: true,
            field: 'org_id',
            defaultValue: null,
          })
    declare orgId?: number | null;
    @BelongsTo(() => SysOrganization, {
            foreignKey: 'orgId',
            targetKey: 'id',
            as: 'organization',
          })
    declare organization?: SysOrganization;
    @ForeignKey(() => Project)
    @Column({
            type: DataType.UUID,
            allowNull: true,
            field: 'project_id',
            defaultValue: null,
          })
    declare projectId?: string | null;
}
