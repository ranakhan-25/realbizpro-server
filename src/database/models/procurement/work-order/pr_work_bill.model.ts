import { BelongsTo, Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import { Project } from '../../projects/project/pr_project.model';
import { Contractor } from '../../projects/contract/pr_contractor.model';
import { ProcurementWorkOrder } from './pr_procurement_work_order.model';
import { ProcurementWorkOrderMeasurement } from './pr_work_order_measurement.model';

import type { ProcurementWorkBillAttributes, ProcurementWorkBillCreationAttributes } from '../../../types/procurementworkbill.types';

export enum ProcurementWorkBillStatus { PENDING = 'pending', APPROVED = 'approved', REJECTED = 'rejected', PARTIALLY_PAID = 'partially_paid', PAID = 'paid', CANCELLED = 'cancelled' }

@Table({ tableName: 'pr_work_bills', timestamps: true, paranoid: true, underscored: true })
export class ProcurementWorkBill extends BaseModel<ProcurementWorkBillAttributes, ProcurementWorkBillCreationAttributes> {
  @Column({ type: DataType.STRING(60), allowNull: false, unique: true }) declare bill_no: string;
  @ForeignKey(() => ProcurementWorkOrderMeasurement) @Column({ type: DataType.UUID, allowNull: false, unique: true }) declare measurement_id: string;
  @BelongsTo(() => ProcurementWorkOrderMeasurement, { foreignKey: 'measurement_id', targetKey: 'uuid', as: 'measurement', onDelete: 'RESTRICT' }) declare measurement?: ProcurementWorkOrderMeasurement;
  @ForeignKey(() => ProcurementWorkOrder) @Column({ type: DataType.UUID, allowNull: false }) declare work_order_id: string;
  @BelongsTo(() => ProcurementWorkOrder, { foreignKey: 'work_order_id', targetKey: 'uuid', as: 'workOrder', onDelete: 'RESTRICT' }) declare workOrder?: ProcurementWorkOrder;
  @ForeignKey(() => Project) @Column({ type: DataType.UUID, allowNull: false }) declare project_id: string;
  @BelongsTo(() => Project, { foreignKey: 'project_id', targetKey: 'uuid', as: 'project', onDelete: 'RESTRICT' }) declare project?: Project;
  @ForeignKey(() => Contractor) @Column({ type: DataType.UUID, allowNull: false }) declare vendor_id: string;
  @BelongsTo(() => Contractor, { foreignKey: 'vendor_id', targetKey: 'uuid', as: 'vendor', onDelete: 'RESTRICT' }) declare vendor?: Contractor;
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 }) declare net_amount: number;
  @Column({ type: DataType.STRING(30), allowNull: false, defaultValue: ProcurementWorkBillStatus.PENDING }) declare status: ProcurementWorkBillStatus;
  @Column({ type: DataType.STRING, allowNull: true }) declare created_by?: string;
  @Column({ type: DataType.STRING, allowNull: true }) declare updated_by?: string;
  @Column({ type: DataType.STRING, allowNull: true }) declare deleted_by?: string;
}
