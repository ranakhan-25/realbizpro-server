import { BelongsTo, Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import { BaseModel } from '../../../base.model';
import { ProcurementItemEntry } from '../configuration/products/pr_item_entry.model';
import { ProcurementUnit } from '../configuration/products/pr_unit.model';
import { ProcurementPurchaseOrderItem } from '../purchase-order/pr_purchase_order_item.model';
import { ProcurementGrn } from './pr_grn.model';

import type { ProcurementGrnItemAttributes, ProcurementGrnItemCreationAttributes } from '../../../types/procurementgrnitem.types';

@Table({ tableName: 'pr_grn_items', timestamps: true, paranoid: true, underscored: true })
export class ProcurementGrnItem extends BaseModel<ProcurementGrnItemAttributes, ProcurementGrnItemCreationAttributes> {
  @ForeignKey(() => ProcurementGrn) @Column({ type: DataType.UUID, allowNull: false }) declare grn_id: string;
  @BelongsTo(() => ProcurementGrn, { foreignKey: 'grn_id', targetKey: 'uuid', as: 'grn', onDelete: 'CASCADE' }) declare grn?: ProcurementGrn;
  @ForeignKey(() => ProcurementPurchaseOrderItem) @Column({ type: DataType.UUID, allowNull: true }) declare purchase_order_item_id?: string;
  @BelongsTo(() => ProcurementPurchaseOrderItem, { foreignKey: 'purchase_order_item_id', targetKey: 'uuid', as: 'purchaseOrderItem' }) declare purchaseOrderItem?: ProcurementPurchaseOrderItem;
  @ForeignKey(() => ProcurementItemEntry) @Column({ type: DataType.UUID, allowNull: true }) declare item_id?: string;
  @BelongsTo(() => ProcurementItemEntry, { foreignKey: 'item_id', targetKey: 'uuid', as: 'item' }) declare item?: ProcurementItemEntry;
  @ForeignKey(() => ProcurementUnit) @Column({ type: DataType.UUID, allowNull: true }) declare unit_id?: string;
  @BelongsTo(() => ProcurementUnit, { foreignKey: 'unit_id', targetKey: 'uuid', as: 'unitRelation' }) declare unitRelation?: ProcurementUnit;
  @Column({ type: DataType.STRING(100), allowNull: false }) declare item_code: string;
  @Column({ type: DataType.STRING(255), allowNull: false }) declare item_name: string;
  @Column({ type: DataType.TEXT, allowNull: true }) declare details?: string;
  @Column({ type: DataType.STRING(255), allowNull: true }) declare unit?: string;
  @Column({ type: DataType.DECIMAL(15, 3), allowNull: false, defaultValue: 0 }) declare quantity: number;
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 }) declare rate: number;
  @Column({ type: DataType.DECIMAL(15, 3), allowNull: false, defaultValue: 0 }) declare budget_qty: number;
  @Column({ type: DataType.DECIMAL(15, 3), allowNull: false, defaultValue: 0 }) declare purchase_qty: number;
  @Column({ type: DataType.DECIMAL(15, 3), allowNull: false, defaultValue: 0 }) declare stock_qty: number;
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 }) declare amount: number;
  @Column({ type: DataType.STRING, allowNull: true }) declare createdBy?: string;
  @Column({ type: DataType.STRING, allowNull: true }) declare updatedBy?: string;
  @Column({ type: DataType.STRING, allowNull: true }) declare deletedBy?: string;
}
