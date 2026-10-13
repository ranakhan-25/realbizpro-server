import { Column, DataType, Table, BelongsTo } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { CrmInternalTask } from './crm_internal_task.model';

import type { CrmInternalTaskAssigneeAttributes, CrmInternalTaskAssigneeCreationAttributes } from '../../types/crminternaltaskassignee.types';

@Table({
  tableName: 'crm_internal_task_assignees',
  timestamps: true,
  paranoid: true,
})
export class CrmInternalTaskAssignee extends BaseModel<CrmInternalTaskAssigneeAttributes, CrmInternalTaskAssigneeCreationAttributes> {
  @Column({ type: DataType.BIGINT, allowNull: false })
  task_id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  user_id: string;

  @Column({ type: DataType.STRING, allowNull: true })
  assigned_by?: string;

  @Column({ type: DataType.STRING, defaultValue: 'assigned' })
  status: string;

  @Column({ type: DataType.DATE, allowNull: true })
  completed_at?: Date;

  @Column({ type: DataType.STRING, allowNull: true, field: 'created_by' })
  declare createdBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'updated_by' })
  declare updatedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'deleted_by' })
  declare deletedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'project_id' })
  declare projectId?: string;

  @BelongsTo(() => CrmInternalTask, { foreignKey: 'task_id' })
  task: CrmInternalTask;
}
