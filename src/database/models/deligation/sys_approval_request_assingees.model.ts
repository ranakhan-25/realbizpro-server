import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import type {
  SysRequestAssigneeAttributes,
  SysRequestAssigneeCreationAttributes,
} from 'src/database/types/sys_approval_request_assingees.model.types';
import { SysUser } from '../system/sys_user.model';
import { SysApprovalRequest } from './sys_approval_requests.model';
import { SysApprovalStep } from './sys_approval_steps.model';
import { SysApprovalWorkflow } from './sys_approval_workflows.model';

/**
 * Stores the assigned approvers per REQUEST + STEP + USER.
 * Allows:
 * - Step-2/3/4 visibility before activation
 * - Delegation (assigned_to = delegateId)
 * - Fast pending request searching
 * - Escalation by updating assigned_to
 */

@Table({
  tableName: 'sys_approval_request_assingees',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class SysRequestAssignee extends BaseModel<
  SysRequestAssigneeAttributes,
  SysRequestAssigneeCreationAttributes
> {
  @ForeignKey(() => SysApprovalRequest)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    field: 'request_id',
  })
  declare requestId: number;

  @BelongsTo(
    () => SysApprovalRequest,
    'requestId',
  )
  declare request?: SysApprovalRequest;

  @ForeignKey(() => SysApprovalStep)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    field: 'step_id',
  })
  declare stepId: number;
  @BelongsTo(() => SysApprovalStep, 'stepId')
  declare step?: SysApprovalStep;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'step_number',
    comment:
      'Step sequence (1,2,3...) copied for optimization',
  })
  declare stepNumber: number;

  @ForeignKey(() => SysUser)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    field: 'assigned_to',
    comment: 'User who will approve this step',
  })
  declare assignedTo: number;
  @BelongsTo(() => SysUser, 'assignedTo')
  declare assignedUser?: SysUser;

  @ForeignKey(() => SysUser)
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    field: 'delegated_from',
    comment: 'Original approver if delegated',
  })
  declare delegatedFrom?: number;
  @BelongsTo(() => SysUser, 'delegatedFrom')
  declare delegatedFromUser?: SysUser;

  @Column({
    type: DataType.ENUM(
      'waiting',
      'pending',
      'approved',
      'rejected',
      'skipped',
      'system_approved',
      'system_rejected',
      'expired',
    ),
    allowNull: false,
    defaultValue: 'waiting',
  })
  declare status: string;

  @ForeignKey(() => SysApprovalWorkflow)
  @Column({
    type: DataType.STRING,
    allowNull: true,
    comment:
      'Workflow instance slug for tracking',
  })
  declare workflowSlug?: string;

  @BelongsTo(() => SysApprovalWorkflow, {
    foreignKey: 'workflowSlug',
    targetKey: 'slug',
  })
  declare workflow?: SysApprovalWorkflow;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    comment:
      'Source table name of the approval request',
  })
  declare referenceTable?: string;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    comment:
      'Source table record ID of the approval request',
  })
  declare referenceId?: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'action_at',
    comment:
      'Time when this user approved/rejected',
  })
  declare actionAt?: Date;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment:
      'Optional comment for approval/rejection',
  })
  declare actionComment?: string;
}
