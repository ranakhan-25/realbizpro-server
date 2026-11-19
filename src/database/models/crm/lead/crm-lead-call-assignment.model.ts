import { BelongsTo, Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { SysOrganization } from 'src/database/models/system/sys_organization.model';
import { Lead } from './crm-lead.model';

import type { LeadCallAssignmentAttributes, LeadCallAssignmentCreationAttributes } from '../../../types/leadcallassignment.types';

@Table({ tableName: 'crm_lead_call_assigns', timestamps: true, paranoid: true, underscored: true })
export class LeadCallAssignment extends BaseModel<LeadCallAssignmentAttributes, LeadCallAssignmentCreationAttributes> {
  @ForeignKey(() => Lead)
  @Column({ type: DataType.BIGINT, allowNull: false, field: 'lead_id' }) declare leadId: number;
  @Column({ type: DataType.UUID, allowNull: false, field: 'assigned_from' }) declare assignedFrom: string;
  @Column({ type: DataType.UUID, allowNull: false, field: 'assigned_to' }) declare assignedTo: string;
  @Column({ type: DataType.DATE, allowNull: false, field: 'assignment_date' }) declare assignmentDate: Date;
  @Column({ type: DataType.DATE, allowNull: true, field: 'due_date' }) declare dueDate?: Date;
  @Column({ type: DataType.STRING(50), allowNull: true }) declare priority?: string;
  @Column({ type: DataType.TEXT, allowNull: true }) declare instruction?: string;
  @Column({ type: DataType.STRING(50), allowNull: true }) declare status?: string;
  @Column({ type: DataType.DATE, allowNull: true, field: 'completed_at' }) declare completedAt?: Date;
  @Column({ type: DataType.STRING(50), allowNull: true, field: 'assigned_user_type' }) declare assignedUserType?: string;
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

  @Column({ type: DataType.STRING, allowNull: true, field: 'created_by', defaultValue: null }) declare createdBy?: string | null;
  @Column({ type: DataType.STRING, allowNull: true, field: 'updated_by', defaultValue: null }) declare updatedBy?: string | null;
  @Column({ type: DataType.STRING, allowNull: true, field: 'deleted_by', defaultValue: null }) declare deletedBy?: string | null;
  @Column({ type: DataType.STRING, allowNull: true, field: 'project_id' }) declare projectId?: string;

  @BelongsTo(() => Lead, { foreignKey: 'leadId', targetKey: 'id', as: 'lead' }) declare lead?: Lead;
  @BelongsTo(() => SysUser, { foreignKey: 'assignedFrom', targetKey: 'uuid', as: 'assigner' }) declare assigner?: SysUser;
  @BelongsTo(() => SysUser, { foreignKey: 'assignedTo', targetKey: 'uuid', as: 'assignee' }) declare assignee?: SysUser;
}
