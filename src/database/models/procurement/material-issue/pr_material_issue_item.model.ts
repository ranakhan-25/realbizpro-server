import { SysOrganization } from 'src/database/models/system/sys_organization.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
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

  @ForeignKey(() => Project)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'project_id',
    defaultValue: null,
  })
  declare projectId?: string | null;

  @BelongsTo(() => Project, {
    foreignKey: 'projectId',
    targetKey: 'uuid',
    as: 'project',
  })
  declare project?: Project;

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
