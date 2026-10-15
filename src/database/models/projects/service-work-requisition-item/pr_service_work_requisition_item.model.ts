/* eslint-disable prettier/prettier */

import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';

import { BaseModel } from 'src/database/base.model';

import {
  ServiceWorkRequisitionItemAttributes,
  ServiceWorkRequisitionItemCreationAttributes,
  ServiceWorkRequisitionItemUpdateAttributes,
} from 'src/database/types/serviceworkrequisitionitem.types';
import { ServiceWorkRequisition } from '../service-work-requisition/pr_service_work_requisition.model';


@Table({
  tableName: 'service_work_requisition_items',
  timestamps: true,
  paranoid: true,
  underscored: false,
})
export class ServiceWorkRequisitionItem
  extends BaseModel<
    ServiceWorkRequisitionItemUpdateAttributes,
    ServiceWorkRequisitionItemCreationAttributes
  >
  implements ServiceWorkRequisitionItemAttributes
{
  // =========================
  // PARENT REQUISITION
  // =========================

  @ForeignKey(() => ServiceWorkRequisition)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare serviceWorkRequisitionId: string;

  @BelongsTo(() => ServiceWorkRequisition, {
    foreignKey: 'serviceWorkRequisitionId',
    targetKey: 'uuid',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  declare requisition?: ServiceWorkRequisition;

  // =========================
  // ITEM DETAILS
  // =========================

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  declare date: Date;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare code: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare serviceItemName: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare unitType?: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 1.0,
  })
  declare qtyDays: number;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0.0,
  })
  declare rate: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare scopeDetailsOrRemarks?: string;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0.0,
  })
  declare amount: number;

  // =========================
  // AUDIT
  // =========================

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
