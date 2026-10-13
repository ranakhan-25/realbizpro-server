import { Column, DataType, Table, HasMany } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { CrmInternalTaskAssignee } from './crm_internal_task_assignee.model';

import type { CrmInternalTaskAttributes, CrmInternalTaskCreationAttributes } from '../../types/crminternaltask.types';

@Table({
  tableName: 'crm_internal_tasks',
  timestamps: true,
  paranoid: true,
})
export class CrmInternalTask extends BaseModel<CrmInternalTaskAttributes, CrmInternalTaskCreationAttributes> {
  @Column({ type: DataType.BIGINT, allowNull: true })
  task_type_id?: number;

  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  description?: string;

  @Column({ type: DataType.STRING, defaultValue: 'medium' })
  priority: string;

  @Column({ type: DataType.DATE, allowNull: true })
  due_date?: Date;

  @Column({ type: DataType.STRING, defaultValue: 'todo' })
  status: string;

  @Column({ type: DataType.BIGINT, allowNull: true })
  related_lead_id?: number;

  @Column({ type: DataType.STRING, allowNull: true, field: 'created_by' })
  declare createdBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'updated_by' })
  declare updatedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'deleted_by' })
  declare deletedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'project_id' })
  declare projectId?: string;

  @HasMany(() => CrmInternalTaskAssignee, { foreignKey: 'task_id' })
  assignees: CrmInternalTaskAssignee[];
}
