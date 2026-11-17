import { BelongsTo, Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { SysOrganization } from 'src/database/models/system/sys_organization.model';

import type { CrmLeadPipelineAttributes, CrmLeadPipelineCreationAttributes } from '../../../types/crmleadpipeline.types';

@Table({
  tableName: 'crm_lead_pipelines',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class CrmLeadPipeline extends BaseModel<CrmLeadPipelineAttributes, CrmLeadPipelineCreationAttributes> {
  @ForeignKey(() => Project)
  @Column({ type: DataType.UUID, allowNull: false, field: 'project_id' })
  declare projectId: string;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0, field: 'initial_leads_count' })
  declare initialLeadsCount: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0, field: 'estimated_pipeline_value' })
  declare estimatedPipelineValue: number;

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

  @Column({ type: DataType.STRING(255), allowNull: true, field: 'created_by', defaultValue: null })
  declare createdBy?: string | null;

  @Column({ type: DataType.STRING(255), allowNull: true, field: 'updated_by', defaultValue: null })
  declare updatedBy?: string | null;

  @Column({ type: DataType.STRING(255), allowNull: true, field: 'deleted_by', defaultValue: null })
  declare deletedBy?: string | null;

  @BelongsTo(() => Project, { foreignKey: 'projectId', targetKey: 'uuid', as: 'project' })
  declare project?: Project;
}
