import { BelongsTo, Column, DataType, ForeignKey, HasMany, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import { Project } from '../../projects/project/pr_project.model';
import { Contractor } from '../../projects/contract/pr_contractor.model';
import { ServiceWorkRequisition } from '../../projects/service-work-requisition/pr_service_work_requisition.model';
import { ProcurementWorkOrderItem } from './pr_procurement_work_order_item.model';
import { ProcurementWorkOrderMeasurement } from './pr_work_order_measurement.model';
import { ProcurementWorkBill } from './pr_work_bill.model';

import type { ProcurementWorkOrderAttributes, ProcurementWorkOrderCreationAttributes } from '../../../types/procurementworkorder.types';

export enum ProcurementWorkOrderMode { REQUISITION_BASED = 'requisition_based', FREE = 'free' }
export enum ProcurementWorkOrderType { SUBCONTRACT = 'subcontract', LABOUR = 'labour' }
export enum ProcurementWorkOrderStatus { PENDING = 'pending', ACTIVE = 'active', COMPLETED = 'completed', CANCELLED = 'cancelled' }

@Table({ tableName: 'pr_procurement_work_orders', timestamps: true, paranoid: true, underscored: true })
export class ProcurementWorkOrder extends BaseModel<ProcurementWorkOrderAttributes, ProcurementWorkOrderCreationAttributes> {
  @Column({ type: DataType.STRING(60), allowNull: false, unique: true }) declare work_order_no: string;
  @Column({ type: DataType.STRING(255), allowNull: false }) declare title: string;
  @Column({ type: DataType.STRING(30), allowNull: false }) declare mode: ProcurementWorkOrderMode;
  @Column({ type: DataType.STRING(30), allowNull: false }) declare type: ProcurementWorkOrderType;
  @ForeignKey(() => ServiceWorkRequisition) @Column({ type: DataType.UUID, allowNull: true }) declare requisition_id?: string;
  @BelongsTo(() => ServiceWorkRequisition, { foreignKey: 'requisition_id', targetKey: 'uuid', as: 'requisition', onDelete: 'SET NULL' }) declare requisition?: ServiceWorkRequisition;
  @ForeignKey(() => Project) @Column({ type: DataType.UUID, allowNull: false }) declare project_id: string;
  @BelongsTo(() => Project, { foreignKey: 'project_id', targetKey: 'uuid', as: 'project', onDelete: 'RESTRICT' }) declare project?: Project;
  @ForeignKey(() => Contractor) @Column({ type: DataType.UUID, allowNull: false }) declare subcontractor_id: string;
  @BelongsTo(() => Contractor, { foreignKey: 'subcontractor_id', targetKey: 'uuid', as: 'subcontractor', onDelete: 'RESTRICT' }) declare subcontractor?: Contractor;
  @Column({ type: DataType.DATEONLY, allowNull: true }) declare start_date?: string;
  @Column({ type: DataType.DATEONLY, allowNull: true }) declare end_date?: string;
  @Column({ type: DataType.TEXT, allowNull: true }) declare notes?: string;
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 }) declare subtotal: number;
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 }) declare vat_total: number;
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 }) declare ait_tds_total: number;
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 }) declare discount: number;
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 }) declare contract_amount: number;
  @Column({ type: DataType.STRING(30), allowNull: false, defaultValue: ProcurementWorkOrderStatus.PENDING }) declare status: ProcurementWorkOrderStatus;
  @Column({ type: DataType.STRING, allowNull: true }) declare created_by?: string;
  @Column({ type: DataType.STRING, allowNull: true }) declare updated_by?: string;
  @Column({ type: DataType.STRING, allowNull: true }) declare deleted_by?: string;
  @HasMany(() => ProcurementWorkOrderItem, { foreignKey: 'work_order_id', sourceKey: 'uuid', as: 'items', onDelete: 'CASCADE' }) declare items?: ProcurementWorkOrderItem[];
  @HasMany(() => ProcurementWorkOrderMeasurement, { foreignKey: 'work_order_id', sourceKey: 'uuid', as: 'measurements', onDelete: 'RESTRICT' }) declare measurements?: ProcurementWorkOrderMeasurement[];
  @HasMany(() => ProcurementWorkBill, { foreignKey: 'work_order_id', sourceKey: 'uuid', as: 'workBills', onDelete: 'RESTRICT' }) declare workBills?: ProcurementWorkBill[];
}
