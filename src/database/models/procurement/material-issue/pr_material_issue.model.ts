import { BelongsTo, Column, DataType, ForeignKey, HasMany, Table } from 'sequelize-typescript';
import { BaseModel } from '../../../base.model';
import { ProcurementGrn } from '../grn/pr_grn.model';
import { SysUser } from '../../system/sys_user.model';
import { ProcurementMaterialIssueItem } from './pr_material_issue_item.model';

import type { ProcurementMaterialIssueAttributes, ProcurementMaterialIssueCreationAttributes } from '../../../types/procurementmaterialissue.types';

export enum ProcurementMaterialIssueStatus { ISSUED = 'issued', CANCELLED = 'cancelled' }

@Table({ tableName: 'pr_material_issues', timestamps: true, paranoid: true, underscored: true })
export class ProcurementMaterialIssue extends BaseModel<ProcurementMaterialIssueAttributes, ProcurementMaterialIssueCreationAttributes> {
  @Column({ type: DataType.STRING(60), allowNull: false, unique: true }) declare issue_no: string;
  @ForeignKey(() => ProcurementGrn) @Column({ type: DataType.UUID, allowNull: false }) declare grn_id: string;
  @BelongsTo(() => ProcurementGrn, { foreignKey: 'grn_id', targetKey: 'uuid', as: 'grn', onDelete: 'RESTRICT' }) declare grn?: ProcurementGrn;
  @Column({ type: DataType.DATEONLY, allowNull: false }) declare date: string;
  @Column({ type: DataType.TEXT, allowNull: false }) declare purpose: string;
  @ForeignKey(() => SysUser) @Column({ type: DataType.BIGINT, allowNull: true }) declare issued_by_id?: number;
  @BelongsTo(() => SysUser, { foreignKey: 'issued_by_id', targetKey: 'id', as: 'issuedBy', onDelete: 'SET NULL' }) declare issuedBy?: SysUser;
  @ForeignKey(() => SysUser) @Column({ type: DataType.BIGINT, allowNull: true }) declare added_by_id?: number;
  @BelongsTo(() => SysUser, { foreignKey: 'added_by_id', targetKey: 'id', as: 'addedBy', onDelete: 'SET NULL' }) declare addedBy?: SysUser;
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 }) declare total_amount: number;
  @Column({ type: DataType.STRING(30), allowNull: false, defaultValue: ProcurementMaterialIssueStatus.ISSUED }) declare status: ProcurementMaterialIssueStatus;
  @Column({ type: DataType.TEXT, allowNull: true }) declare notes?: string;
  @HasMany(() => ProcurementMaterialIssueItem, { foreignKey: 'material_issue_id', sourceKey: 'uuid', as: 'items', onDelete: 'CASCADE' }) declare items?: ProcurementMaterialIssueItem[];
}
