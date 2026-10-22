import { BelongsTo, Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import { BaseModel } from '../../../base.model';
import { ProcurementItemEntry } from '../configuration/products/pr_item_entry.model';
import { ProcurementUnit } from '../configuration/products/pr_unit.model';
import { ProcurementMaterialRequisition } from './pr_material_requisition.model';

import type { ProcurementMaterialRequisitionItemAttributes, ProcurementMaterialRequisitionItemCreationAttributes } from '../../../types/procurementmaterialrequisitionitem.types';

@Table({ tableName: 'pr_material_requisition_items', timestamps: true, paranoid: true, underscored: true })
export class ProcurementMaterialRequisitionItem extends BaseModel<ProcurementMaterialRequisitionItemAttributes, ProcurementMaterialRequisitionItemCreationAttributes> {
  @ForeignKey(() => ProcurementMaterialRequisition) @Column({ type: DataType.UUID, allowNull: false }) declare requisition_id: string;
  @BelongsTo(() => ProcurementMaterialRequisition, { foreignKey: 'requisition_id', targetKey: 'uuid', as: 'requisition', onDelete: 'CASCADE' }) declare requisition?: ProcurementMaterialRequisition;
  @ForeignKey(() => ProcurementItemEntry) @Column({ type: DataType.UUID, allowNull: true }) declare item_id?: string;
  @BelongsTo(() => ProcurementItemEntry, { foreignKey: 'item_id', targetKey: 'uuid', as: 'item' }) declare item?: ProcurementItemEntry;
  @ForeignKey(() => ProcurementUnit) @Column({ type: DataType.UUID, allowNull: true }) declare unit_id?: string;
  @BelongsTo(() => ProcurementUnit, { foreignKey: 'unit_id', targetKey: 'uuid', as: 'unitRelation' }) declare unitRelation?: ProcurementUnit;
  @Column({ type: DataType.STRING(100), allowNull: false }) declare item_code: string;
  @Column({ type: DataType.STRING(255), allowNull: true }) declare item_name?: string;
  @Column({ type: DataType.TEXT, allowNull: true }) declare details?: string;
  @Column({ type: DataType.STRING(255), allowNull: true }) declare unit?: string;
  @Column({ type: DataType.DECIMAL(15, 3), allowNull: false, defaultValue: 0 }) declare budget_qty: number;
  @Column({ type: DataType.DECIMAL(15, 3), allowNull: false, defaultValue: 0 }) declare already_purchase_qty: number;
  @Column({ type: DataType.DECIMAL(15, 3), allowNull: false, defaultValue: 0 }) declare available_qty: number;
  @Column({ type: DataType.DECIMAL(15, 3), allowNull: false, defaultValue: 0 }) declare demand_qty: number;
  @Column({ type: DataType.DECIMAL(15, 3), allowNull: false, defaultValue: 0 }) declare stock: number;
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 }) declare rate: number;
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 }) declare amount: number;
  @Column({ type: DataType.STRING, allowNull: true }) declare createdBy?: string;
  @Column({ type: DataType.STRING, allowNull: true }) declare updatedBy?: string;
  @Column({ type: DataType.STRING, allowNull: true }) declare deletedBy?: string;
}
