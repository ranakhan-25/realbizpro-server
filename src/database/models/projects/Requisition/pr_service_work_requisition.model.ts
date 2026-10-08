/* eslint-disable prettier/prettier */

import {
  Column,
  DataType,
  HasMany,
  Table,
} from 'sequelize-typescript';

import { BaseModel } from 'src/database/base.model';

import {
  ServiceWorkRequisitionAttributes,
  ServiceWorkRequisitionCreationAttributes,
  ServiceWorkRequisitionUpdateAttributes,
} from 'src/database/types/serviceworkrequisition.types';
import { ServiceWorkRequisitionItem } from './pr_service_work_requisition_item_model';

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

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare targetProjectId?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare titleOrWorkNameId?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare taskSubcategory?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare constructionSiteId?: string;

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
  // RELATIONS
  // =========================

  @HasMany(() => ServiceWorkRequisitionItem, {
    foreignKey: 'serviceWorkRequisitionId',
    sourceKey: 'uuid',
    onDelete: 'CASCADE',
  })
  declare items?: ServiceWorkRequisitionItem[];

  // =========================
  // AUDIT
  // =========================

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
}
