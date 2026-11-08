import { SysOrganization } from 'src/database/models/system/sys_organization.model';
import { BelongsTo, Column, DataType, ForeignKey, HasOne, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import { Project } from '../../projects/project/pr_project.model';
import { ProcurementWorkOrder } from './pr_procurement_work_order.model';
import { ProcurementWorkBill } from './pr_work_bill.model';

import type { ProcurementWorkOrderMeasurementAttributes, ProcurementWorkOrderMeasurementCreationAttributes } from '../../../types/procurementworkordermeasurement.types';

@Table({ tableName: 'pr_work_order_measurements', timestamps: true, paranoid: true, underscored: true })
export class ProcurementWorkOrderMeasurement extends BaseModel<ProcurementWorkOrderMeasurementAttributes, ProcurementWorkOrderMeasurementCreationAttributes> {
  @Column({ type: DataType.STRING(60), allowNull: false, unique: true }) declare measurement_no: string;
  @ForeignKey(() => ProcurementWorkOrder) @Column({ type: DataType.UUID, allowNull: false }) declare work_order_id: string;
  @BelongsTo(() => ProcurementWorkOrder, { foreignKey: 'work_order_id', targetKey: 'uuid', as: 'workOrder', onDelete: 'RESTRICT' }) declare workOrder?: ProcurementWorkOrder;
  @ForeignKey(() => Project) @Column({ type: DataType.UUID, allowNull: false }) declare project_id: string;
  @BelongsTo(() => Project, { foreignKey: 'project_id', targetKey: 'uuid', as: 'project', onDelete: 'RESTRICT' }) declare project?: Project;
  @Column({ type: DataType.DATEONLY, allowNull: false }) declare date: string;
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 }) declare amount: number;
  @Column({ type: DataType.STRING(30), allowNull: false, defaultValue: 'pending' }) declare status: string;
  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false }) declare is_billed: boolean;
  @Column({ type: DataType.TEXT, allowNull: true }) declare notes?: string;
  @HasOne(() => ProcurementWorkBill, { foreignKey: 'measurement_id', sourceKey: 'uuid', as: 'workBill', onDelete: 'RESTRICT' }) declare workBill?: ProcurementWorkBill;


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
