import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import type {
  SysApprovalRequestAttributes,
  SysApprovalRequestCreationAttributes,
} from '../../types/sysapprovalrequest.types';
import { SysApprovalHistory } from './sys_approval_history.model';
import { SysApprovalWorkflow } from './sys_approval_workflows.model';
import { SysDelegationStatus } from './sys_delegation_statuses.model';
import { SysRequestAssignee } from './sys_request_assignees.model';
import { SysApprovalStep } from './sys_approval_steps.model';

@Table({
  tableName: 'sys_approval_requests',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class SysApprovalRequest extends BaseModel<
  SysApprovalRequestAttributes,
  SysApprovalRequestCreationAttributes
> {
  @ForeignKey(() => SysApprovalWorkflow)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    field: 'workflow_id',
  })
  declare workflowId: number;

  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    field: 'reference_id',
    comment:
      'Reference ID from source table (leave_id, pr_id, etc.)',
  })
  declare referenceId: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    field: 'reference_table',
  })
  declare referenceTable?: string;

  @ForeignKey(() => SysApprovalStep)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'current_step',
  })
  declare currentStep: number;
  @BelongsTo(() => SysApprovalStep, 'workflowId')
  declare currentApprovalStep?: SysApprovalStep;

  @ForeignKey(() => SysDelegationStatus)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  declare statusId: number;

  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    field: 'requested_by',
  })
  declare requestedBy: number;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
    field: 'session_variables',
  })
  declare sessionVariables?: object;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare remarks?: string;

  @BelongsTo(
    () => SysApprovalWorkflow,
    'workflowId',
  )
  declare workflow?: SysApprovalWorkflow;

  @BelongsTo(
    () => SysDelegationStatus,
    'statusId',
  )
  declare status?: SysDelegationStatus;

  @HasMany(() => SysApprovalHistory)
  declare history?: SysApprovalHistory[];

  @HasMany(() => SysRequestAssignee, 'requestId')
  declare assignees?: SysRequestAssignee[];
}
