import { SysOrganization } from 'src/database/models/system/sys_organization.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { BelongsTo, Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import { BaseModel } from '../../../base.model';
import { ProcurementBoq } from './pr_procurement_boq.model';
import type { ProcurementBoqNoteAttributes, ProcurementBoqNoteCreationAttributes } from '../../../types/procurementboqnote.types';

@Table({ tableName: 'pr_procurement_boq_notes', timestamps: true, paranoid: true, underscored: true })
export class ProcurementBoqNote extends BaseModel<ProcurementBoqNoteAttributes, ProcurementBoqNoteCreationAttributes> {
  @ForeignKey(() => ProcurementBoq) @Column({ type: DataType.UUID, allowNull: false }) declare boq_id: string;
  @BelongsTo(() => ProcurementBoq, { foreignKey: 'boq_id', targetKey: 'uuid', as: 'boq', onDelete: 'CASCADE' }) declare boq?: ProcurementBoq;
  @Column({ type: DataType.TEXT, allowNull: false }) declare note: string;
  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 }) declare sort_order: number;


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
