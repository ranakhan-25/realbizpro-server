import { BelongsTo, Column, DataType, ForeignKey, HasMany, Table } from 'sequelize-typescript';
import { BaseModel } from '../../../base.model';
import { ProcurementHireOrder } from './pr_hire_order.model';
import { ProcurementAssetItemEntry } from '../configuration/asset/pr_asset_item_entry.model';
import { ProcurementAssetRequisitionItem } from '../requisition/pr_asset_requisition_item.model';
import { ProcurementUnit } from '../configuration/products/pr_unit.model';
import { ProcurementHireInItem } from './pr_hire_in_item.model';
import { ProcurementHireOutItem } from './pr_hire_out_item.model';
import { ProcurementHireBillItem } from './pr_hire_bill_item.model';
import type { ProcurementHireOrderItemAttributes, ProcurementHireOrderItemCreationAttributes } from '../../../types/procurementhireorderitem.types';

@Table({ tableName: 'pr_hire_order_items', timestamps: true, paranoid: true, underscored: true })
export class ProcurementHireOrderItem extends BaseModel<ProcurementHireOrderItemAttributes, ProcurementHireOrderItemCreationAttributes> {
  @ForeignKey(() => ProcurementHireOrder) @Column({ type: DataType.UUID, allowNull: false }) declare hire_order_id: string;
  @BelongsTo(() => ProcurementHireOrder, { foreignKey: 'hire_order_id', targetKey: 'uuid', as: 'hireOrder', onDelete: 'CASCADE' }) declare hireOrder?: ProcurementHireOrder;
  @ForeignKey(() => ProcurementAssetItemEntry) @Column({ type: DataType.UUID, allowNull: true }) declare equipment_id?: string;
  @BelongsTo(() => ProcurementAssetItemEntry, { foreignKey: 'equipment_id', targetKey: 'uuid', as: 'equipment' }) declare equipment?: ProcurementAssetItemEntry;
  @ForeignKey(() => ProcurementAssetRequisitionItem) @Column({ type: DataType.UUID, allowNull: true }) declare requisition_item_id?: string;
  @BelongsTo(() => ProcurementAssetRequisitionItem, { foreignKey: 'requisition_item_id', targetKey: 'uuid', as: 'requisitionItem' }) declare requisitionItem?: ProcurementAssetRequisitionItem;
  @ForeignKey(() => ProcurementUnit) @Column({ type: DataType.UUID, allowNull: true }) declare unit_id?: string;
  @BelongsTo(() => ProcurementUnit, { foreignKey: 'unit_id', targetKey: 'uuid', as: 'unitRelation' }) declare unitRelation?: ProcurementUnit;
  @Column({ type: DataType.STRING(255), allowNull: false }) declare equipment_description: string;
  @Column({ type: DataType.STRING(255), allowNull: false }) declare unit: string;
  @Column({ type: DataType.DECIMAL(15, 3), allowNull: false }) declare quantity: number;
  @Column({ type: DataType.STRING(50), allowNull: false, defaultValue: 'day' }) declare charged_by: string;
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 }) declare rate: number;
  @Column({ type: DataType.DECIMAL(7, 3), allowNull: false, defaultValue: 0 }) declare tax_percent: number;
  @Column({ type: DataType.DECIMAL(7, 3), allowNull: false, defaultValue: 0 }) declare vat_percent: number;
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 }) declare tax_amount: number;
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 }) declare vat_amount: number;
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 }) declare amount: number;
  @HasMany(() => ProcurementHireInItem, { foreignKey: 'hire_order_item_id', sourceKey: 'uuid', as: 'hireInItems' }) declare hireInItems?: ProcurementHireInItem[];
  @HasMany(() => ProcurementHireOutItem, { foreignKey: 'hire_order_item_id', sourceKey: 'uuid', as: 'hireOutItems' }) declare hireOutItems?: ProcurementHireOutItem[];
  @HasMany(() => ProcurementHireBillItem, { foreignKey: 'hire_order_item_id', sourceKey: 'uuid', as: 'billItems' }) declare billItems?: ProcurementHireBillItem[];
  @Column({ type: DataType.STRING, allowNull: true }) declare createdBy?: string;
  @Column({ type: DataType.STRING, allowNull: true }) declare updatedBy?: string;
  @Column({ type: DataType.STRING, allowNull: true }) declare deletedBy?: string;
}
