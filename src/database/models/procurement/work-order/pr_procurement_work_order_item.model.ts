import { SysOrganization } from 'src/database/models/system/sys_organization.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { BelongsTo, Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import { ProcurementWorkOrder } from './pr_procurement_work_order.model';
import { ServiceWorkRequisitionItem } from '../../projects/service-work-requisition-item/pr_service_work_requisition_item.model';

import type { ProcurementWorkOrderItemAttributes, ProcurementWorkOrderItemCreationAttributes } from '../../../types/procurementworkorderitem.types';

@Table({ tableName: 'pr_procurement_work_order_items', timestamps: true, paranoid: true, underscored: true })
export class ProcurementWorkOrderItem extends BaseModel<ProcurementWorkOrderItemAttributes, ProcurementWorkOrderItemCreationAttributes> {
  @ForeignKey(() => ProcurementWorkOrder) @Column({ type: DataType.UUID, allowNull: false }) declare work_order_id: string;
  @BelongsTo(() => ProcurementWorkOrder, { foreignKey: 'work_order_id', targetKey: 'uuid', as: 'workOrder', onDelete: 'CASCADE' }) declare workOrder?: ProcurementWorkOrder;
  @ForeignKey(() => ServiceWorkRequisitionItem) @Column({ type: DataType.UUID, allowNull: true }) declare requisition_item_id?: string;
  @BelongsTo(() => ServiceWorkRequisitionItem, { foreignKey: 'requisition_item_id', targetKey: 'uuid', as: 'requisitionItem', onDelete: 'SET NULL' }) declare requisitionItem?: ServiceWorkRequisitionItem;
  @Column({ type: DataType.STRING(500), allowNull: false }) declare description: string;
  @Column({ type: DataType.STRING(80), allowNull: true }) declare unit?: string;
  @Column({ type: DataType.DECIMAL(15, 3), allowNull: false }) declare quantity: number;
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false }) declare rate: number;
  @Column({ type: DataType.DECIMAL(7, 3), allowNull: false, defaultValue: 0 }) declare tax_percent: number;
  @Column({ type: DataType.DECIMAL(7, 3), allowNull: false, defaultValue: 0 }) declare vat_percent: number;
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false }) declare tax_amount: number;
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false }) declare vat_amount: number;
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false }) declare amount: number;


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

  @BelongsTo(() => Project, {
    foreignKey: 'projectId',
    targetKey: 'uuid',
    as: 'project',
  })
  declare project?: Project;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'created_by',
    defaultValue: null,
  })
  declare createdBy?: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'updated_by',
    defaultValue: null,
  })
  declare updatedBy?: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'deleted_by',
    defaultValue: null,
  })
  declare deletedBy?: string | null;

}
