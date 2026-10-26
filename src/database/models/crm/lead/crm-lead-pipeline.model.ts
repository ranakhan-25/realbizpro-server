import { BelongsTo, Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';

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

  @Column({ type: DataType.STRING(255), allowNull: true, field: 'created_by' })
  declare createdBy?: string;

  @Column({ type: DataType.STRING(255), allowNull: true, field: 'updated_by' })
  declare updatedBy?: string;

  @Column({ type: DataType.STRING(255), allowNull: true, field: 'deleted_by' })
  declare deletedBy?: string;

  @BelongsTo(() => Project, { foreignKey: 'projectId', targetKey: 'uuid', as: 'project' })
  declare project?: Project;
}
