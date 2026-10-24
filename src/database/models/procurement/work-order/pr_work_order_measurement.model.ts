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
}
