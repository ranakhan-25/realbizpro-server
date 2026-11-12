/* eslint-disable prettier/prettier */

import {
  Column,
  DataType,
  HasMany,
  Table, ForeignKey, BelongsTo } from 'sequelize-typescript';

import { BaseModel } from '../../../base.model';

import {
  TaskAttributes,
  TaskCreationAttributes,
  TaskUpdateAttributes,
} from 'src/database/types/task.types';
import { ProcurementRfq } from '../../procurement/rfq/pr_rfq.model';
import { ProcurementAssetRfq } from '../../procurement/rfq/pr_asset_rfq.model';
import { ProcurementMaterialRequisition } from '../../procurement/requisition/pr_material_requisition.model';
import { ProcurementAssetRequisition } from '../../procurement/requisition/pr_asset_requisition.model';
import { ProcurementPurchaseOrder } from '../../procurement/purchase-order/pr_purchase_order.model';
import { ProcurementAssetPurchaseOrder } from '../../procurement/purchase-order/pr_asset_purchase_order.model';
import { ProcurementGrn } from '../../procurement/grn/pr_grn.model';
import { ProcurementAssetGrn } from '../../procurement/grn/pr_asset_grn.model';
import { SysOrganization } from "src/database/models/system/sys_organization.model";
import { Project } from "src/database/models/projects/project/pr_project.model";

export enum TaskStatus {
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  PENDING = 'Pending',
  DELAYED = 'Delayed',
}

export enum TaskPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  URGENT = 'Urgent',
}

@Table({
  tableName: 'pr_task',
  timestamps: true,
  paranoid: true,
  underscored: false,
})
export class Task
  extends BaseModel<
    TaskUpdateAttributes,
    TaskCreationAttributes
  >
  implements TaskAttributes
{
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare uid?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare taskName: string;

  @ForeignKey(() => Task)
  @Column({
    field: 'parent_task_id',
    type: DataType.UUID,
    allowNull: true,
  })
  declare parentTaskId?: string | null;

  @BelongsTo(() => Task, {
    foreignKey: 'parentTaskId',
    targetKey: 'uuid',
    as: 'parentTask',
  })
  declare parentTask?: Task | null;

  @HasMany(() => Task, {
    foreignKey: 'parentTaskId',
    sourceKey: 'uuid',
    as: 'subtasks',
  })
  declare subtasks?: Task[];

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  declare progress: number;

  @Column({
    type: DataType.ENUM(
      ...Object.values(TaskPriority),
    ),
    allowNull: false,
    defaultValue: TaskPriority.MEDIUM,
  })
  declare priority: TaskPriority;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  declare startDate?: Date;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  declare endDate?: Date;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare duration?: string;

  @Column({
    type: DataType.ENUM(
      ...Object.values(TaskStatus),
    ),
    allowNull: false,
    defaultValue: TaskStatus.IN_PROGRESS,
  })
  declare status: TaskStatus;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  declare completeDate?: Date;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: true,
    defaultValue: 0,
  })
  declare budget?: number;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: true,
    defaultValue: 0,
  })
  declare cost?: number;

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

  @HasMany(() => ProcurementRfq, { foreignKey: 'task_id', sourceKey: 'uuid', as: 'procurementRfqs' }) declare procurementRfqs?: ProcurementRfq[];
  @HasMany(() => ProcurementAssetRfq, { foreignKey: 'task_id', sourceKey: 'uuid', as: 'procurementAssetRfqs' }) declare procurementAssetRfqs?: ProcurementAssetRfq[];
  @HasMany(() => ProcurementMaterialRequisition, { foreignKey: 'task_id', sourceKey: 'uuid', as: 'procurementMaterialRequisitions' }) declare procurementMaterialRequisitions?: ProcurementMaterialRequisition[];
  @HasMany(() => ProcurementAssetRequisition, { foreignKey: 'task_id', sourceKey: 'uuid', as: 'procurementAssetRequisitions' }) declare procurementAssetRequisitions?: ProcurementAssetRequisition[];
  @HasMany(() => ProcurementPurchaseOrder, { foreignKey: 'task_id', sourceKey: 'uuid', as: 'procurementPurchaseOrders' }) declare procurementPurchaseOrders?: ProcurementPurchaseOrder[];
  @HasMany(() => ProcurementAssetPurchaseOrder, { foreignKey: 'task_id', sourceKey: 'uuid', as: 'procurementAssetPurchaseOrders' }) declare procurementAssetPurchaseOrders?: ProcurementAssetPurchaseOrder[];
  @HasMany(() => ProcurementGrn, { foreignKey: 'task_id', sourceKey: 'uuid', as: 'procurementGrns' }) declare procurementGrns?: ProcurementGrn[];
  @HasMany(() => ProcurementAssetGrn, { foreignKey: 'task_id', sourceKey: 'uuid', as: 'procurementAssetGrns' }) declare procurementAssetGrns?: ProcurementAssetGrn[];
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
}
