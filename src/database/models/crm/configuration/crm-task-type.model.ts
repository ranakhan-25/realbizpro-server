import { BelongsTo, Column, DataType, ForeignKey, HasMany, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import { Lead } from '../lead/crm-lead.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { SysOrganization } from 'src/database/models/system/sys_organization.model';

import type { TaskTypeAttributes, TaskTypeCreationAttributes } from '../../../types/tasktype.types';

import type { CrmInternalTaskAttributes, CrmInternalTaskCreationAttributes } from '../../../types/crminternaltask.types';

import type { CrmInternalTaskAssigneeAttributes, CrmInternalTaskAssigneeCreationAttributes } from '../../../types/crminternaltaskassignee.types';

@Table({ tableName: 'crm_task_types', timestamps: true, paranoid: true, underscored: true })
export class TaskType extends BaseModel<TaskTypeAttributes, TaskTypeCreationAttributes> {
  @Column({ type: DataType.STRING(255), allowNull: false }) declare name: string;
  @Column({ type: DataType.STRING(255), allowNull: true }) declare code?: string;

  @ForeignKey(() => SysOrganization)
  @Column({ type: DataType.BIGINT, allowNull: true, field: 'org_id', defaultValue: null })
  declare orgId?: number | null;
  @BelongsTo(() => SysOrganization, { foreignKey: 'orgId', targetKey: 'id', as: 'organization' })
  declare organization?: SysOrganization;

  @Column({ type: DataType.STRING(255), allowNull: true, field: 'created_by', defaultValue: null }) declare createdBy?: string | null;
  @Column({ type: DataType.STRING(255), allowNull: true, field: 'updated_by', defaultValue: null }) declare updatedBy?: string | null;
  @Column({ type: DataType.STRING(255), allowNull: true, field: 'deleted_by', defaultValue: null }) declare deletedBy?: string | null;
  @Column({ type: DataType.STRING(255), allowNull: true, field: 'project_id', defaultValue: null }) declare projectId?: string | null;

  @HasMany(() => CrmInternalTask, { foreignKey: 'taskTypeId', sourceKey: 'id', as: 'tasks' }) declare tasks?: CrmInternalTask[];
}

@Table({ tableName: 'crm_internal_tasks', timestamps: true, paranoid: true, underscored: true })
export class CrmInternalTask extends BaseModel<CrmInternalTaskAttributes, CrmInternalTaskCreationAttributes> {
  @ForeignKey(() => TaskType)
  @Column({ type: DataType.BIGINT, allowNull: true, field: 'task_type_id' }) declare taskTypeId?: number;
  @Column({ type: DataType.STRING(255), allowNull: false }) declare title: string;
  @Column({ type: DataType.TEXT, allowNull: true }) declare description?: string;
  @Column({ type: DataType.STRING(255), allowNull: true, defaultValue: 'medium' }) declare priority?: string;
  @Column({ type: DataType.DATE, allowNull: true, field: 'due_date' }) declare dueDate?: Date;
  @Column({ type: DataType.STRING(255), allowNull: true, defaultValue: 'todo' }) declare status?: string;
  @ForeignKey(() => Lead)
  @Column({ type: DataType.BIGINT, allowNull: true, field: 'related_lead_id' }) declare relatedLeadId?: number;

  @ForeignKey(() => SysOrganization)
  @Column({ type: DataType.BIGINT, allowNull: true, field: 'org_id', defaultValue: null })
  declare orgId?: number | null;
  @BelongsTo(() => SysOrganization, { foreignKey: 'orgId', targetKey: 'id', as: 'organization' })
  declare organization?: SysOrganization;

  @Column({ type: DataType.STRING(255), allowNull: true, field: 'created_by', defaultValue: null }) declare createdBy?: string | null;
  @Column({ type: DataType.STRING(255), allowNull: true, field: 'updated_by', defaultValue: null }) declare updatedBy?: string | null;
  @Column({ type: DataType.STRING(255), allowNull: true, field: 'deleted_by', defaultValue: null }) declare deletedBy?: string | null;
  @Column({ type: DataType.STRING(255), allowNull: true, field: 'project_id', defaultValue: null }) declare projectId?: string | null;

  @BelongsTo(() => TaskType, { foreignKey: 'taskTypeId', targetKey: 'id', as: 'taskType' }) declare taskType?: TaskType;
  @BelongsTo(() => Lead, { foreignKey: 'relatedLeadId', targetKey: 'id', as: 'lead' }) declare lead?: Lead;
  @HasMany(() => CrmInternalTaskAssignee, { foreignKey: 'taskId', sourceKey: 'id', as: 'assignees' }) declare assignees?: CrmInternalTaskAssignee[];
}

@Table({ tableName: 'crm_internal_task_assignees', timestamps: true, paranoid: true, underscored: true })
export class CrmInternalTaskAssignee extends BaseModel<CrmInternalTaskAssigneeAttributes, CrmInternalTaskAssigneeCreationAttributes> {
  @ForeignKey(() => CrmInternalTask)
  @Column({ type: DataType.BIGINT, allowNull: false, field: 'task_id' }) declare taskId: number;
  @ForeignKey(() => SysUser)
  @Column({ type: DataType.STRING(255), allowNull: false, field: 'user_id' }) declare userId: string;
  @Column({ type: DataType.STRING(255), allowNull: true, field: 'assigned_by' }) declare assignedBy?: string;
  @Column({ type: DataType.STRING(255), allowNull: true, defaultValue: 'assigned' }) declare status?: string;
  @Column({ type: DataType.DATE, allowNull: true, field: 'completed_at' }) declare completedAt?: Date;

  @ForeignKey(() => SysOrganization)
  @Column({ type: DataType.BIGINT, allowNull: true, field: 'org_id', defaultValue: null })
  declare orgId?: number | null;
  @BelongsTo(() => SysOrganization, { foreignKey: 'orgId', targetKey: 'id', as: 'organization' })
  declare organization?: SysOrganization;

  @Column({ type: DataType.STRING(255), allowNull: true, field: 'created_by', defaultValue: null }) declare createdBy?: string | null;
  @Column({ type: DataType.STRING(255), allowNull: true, field: 'updated_by', defaultValue: null }) declare updatedBy?: string | null;
  @Column({ type: DataType.STRING(255), allowNull: true, field: 'deleted_by', defaultValue: null }) declare deletedBy?: string | null;
  @Column({ type: DataType.STRING(255), allowNull: true, field: 'project_id', defaultValue: null }) declare projectId?: string | null;

  @BelongsTo(() => CrmInternalTask, { foreignKey: 'taskId', targetKey: 'id', as: 'task' }) declare task?: CrmInternalTask;
  @BelongsTo(() => SysUser, { foreignKey: 'userId', targetKey: 'userCode', as: 'assignedUser' }) declare assignedUser?: SysUser;
}
