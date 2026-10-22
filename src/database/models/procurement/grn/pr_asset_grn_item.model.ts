import { BelongsTo, Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import { BaseModel } from '../../../base.model';
import { ProcurementAssetItemEntry } from '../configuration/asset/pr_asset_item_entry.model';
import { ProcurementUnit } from '../configuration/products/pr_unit.model';
import { ProcurementAssetGrn } from './pr_asset_grn.model';

import type { ProcurementAssetGrnItemAttributes, ProcurementAssetGrnItemCreationAttributes } from '../../../types/procurementassetgrnitem.types';

@Table({ tableName: 'pr_asset_grn_items', timestamps: true, paranoid: true, underscored: true })
export class ProcurementAssetGrnItem extends BaseModel<ProcurementAssetGrnItemAttributes, ProcurementAssetGrnItemCreationAttributes> {
  @ForeignKey(() => ProcurementAssetGrn) @Column({ type: DataType.UUID, allowNull: false }) declare grn_id: string;
  @BelongsTo(() => ProcurementAssetGrn, { foreignKey: 'grn_id', targetKey: 'uuid', as: 'grn', onDelete: 'CASCADE' }) declare grn?: ProcurementAssetGrn;
  @ForeignKey(() => ProcurementAssetItemEntry) @Column({ type: DataType.UUID, allowNull: true }) declare item_id?: string;
  @BelongsTo(() => ProcurementAssetItemEntry, { foreignKey: 'item_id', targetKey: 'uuid', as: 'item' }) declare item?: ProcurementAssetItemEntry;
  @ForeignKey(() => ProcurementUnit) @Column({ type: DataType.UUID, allowNull: true }) declare unit_id?: string;
  @BelongsTo(() => ProcurementUnit, { foreignKey: 'unit_id', targetKey: 'uuid', as: 'unitRelation' }) declare unitRelation?: ProcurementUnit;

  @Column({ type: DataType.STRING(100), allowNull: false }) declare item_code: string;
  @Column({ type: DataType.STRING(255), allowNull: false }) declare item_name: string;
  @Column({ type: DataType.TEXT, allowNull: true }) declare details?: string;
  @Column({ type: DataType.STRING(255), allowNull: true }) declare unit?: string;
  @Column({ type: DataType.DECIMAL(15, 3), allowNull: false, defaultValue: 0 }) declare quantity: number;
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 }) declare rate: number;
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 }) declare amount: number;

  @Column({ type: DataType.STRING, allowNull: true }) declare createdBy?: string;
  @Column({ type: DataType.STRING, allowNull: true }) declare updatedBy?: string;
  @Column({ type: DataType.STRING, allowNull: true }) declare deletedBy?: string;
}
