import { BelongsTo, Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import { BaseModel } from '../../../base.model';
import { ProcurementGrnItem } from '../grn/pr_grn_item.model';
import { ProcurementMaterialIssue } from './pr_material_issue.model';

import type { ProcurementMaterialIssueItemAttributes, ProcurementMaterialIssueItemCreationAttributes } from '../../../types/procurementmaterialissueitem.types';

@Table({ tableName: 'pr_material_issue_items', timestamps: true, paranoid: true, underscored: true })
export class ProcurementMaterialIssueItem extends BaseModel<ProcurementMaterialIssueItemAttributes, ProcurementMaterialIssueItemCreationAttributes> {
  @ForeignKey(() => ProcurementMaterialIssue) @Column({ type: DataType.UUID, allowNull: false }) declare material_issue_id: string;
  @BelongsTo(() => ProcurementMaterialIssue, { foreignKey: 'material_issue_id', targetKey: 'uuid', as: 'issue', onDelete: 'CASCADE' }) declare issue?: ProcurementMaterialIssue;
  @ForeignKey(() => ProcurementGrnItem) @Column({ type: DataType.UUID, allowNull: false }) declare grn_item_id: string;
  @BelongsTo(() => ProcurementGrnItem, { foreignKey: 'grn_item_id', targetKey: 'uuid', as: 'grnItem', onDelete: 'RESTRICT' }) declare grnItem?: ProcurementGrnItem;
  @Column({ type: DataType.STRING(100), allowNull: false }) declare item_code: string;
  @Column({ type: DataType.STRING(255), allowNull: false }) declare item_name: string;
  @Column({ type: DataType.TEXT, allowNull: true }) declare details?: string;
  @Column({ type: DataType.STRING(255), allowNull: true }) declare unit?: string;
  @Column({ type: DataType.DECIMAL(15, 3), allowNull: false }) declare quantity: number;
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false }) declare rate: number;
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false }) declare amount: number;
}
