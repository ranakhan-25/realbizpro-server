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
  SysApprovalWorkflowAttributes,
  SysApprovalWorkflowCreationAttributes,
} from '../../types/sysapprovalworkflow.types';
import { SysApprovalStep } from './sys_approval_steps.model';
import { SysDelegationStatus } from './sys_delegation_statuses.model';

@Table({
  tableName: 'sys_approval_workflows',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['slug'],
    },
  ],
})
export class SysApprovalWorkflow extends BaseModel<
  SysApprovalWorkflowAttributes,
  SysApprovalWorkflowCreationAttributes
> {
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    comment:
      'Workflow name (Leave, PR, PO, etc.)',
  })
  declare workflowName: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    comment: 'Unique slug identifier',
  })
  declare slug: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    comment:
      'Session variables: dept_id, amount, grade, buyer_id, etc.',
  })
  declare sessionVariable?: string;

  @ForeignKey(() => SysDelegationStatus)
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    comment: 'Draft status ID',
  })
  declare draftStatusId?: number;

  @ForeignKey(() => SysDelegationStatus)
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    comment: 'Initiate approve status ID',
  })
  declare initiateApproveStatusId?: number;

  @ForeignKey(() => SysDelegationStatus)
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    comment: 'After approve status ID',
  })
  declare afterApproveStatusId?: number;

  @ForeignKey(() => SysDelegationStatus)
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    comment: 'After decline status ID',
  })
  declare afterDeclineStatusId?: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    comment:
      'Reference table (hr_leave_requests, pr_requests, etc.)',
  })
  declare refDbTableName?: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  declare refIdField?: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  declare refStatusField?: string;

  @ForeignKey(() => SysDelegationStatus)
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    comment: 'After reject status ID',
  })
  declare afterRejectStatusId?: number;

  //after final approval caled service url
  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    comment: 'Callback URL after final approval',
  })
  declare callbackUrl?: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  declare isActive: boolean;

  @HasMany(() => SysApprovalStep)
  declare steps?: SysApprovalStep[];

  @BelongsTo(
    () => SysDelegationStatus,
    'draftStatusId',
  )
  declare draftStatus?: SysDelegationStatus;

  @BelongsTo(
    () => SysDelegationStatus,
    'initiateApproveStatusId',
  )
  declare initiateApproveStatus?: SysDelegationStatus;

  @BelongsTo(
    () => SysDelegationStatus,
    'afterApproveStatusId',
  )
  declare afterApproveStatus?: SysDelegationStatus;

  //after reject status
  @BelongsTo(
    () => SysDelegationStatus,
    'afterRejectStatusId',
  )
  declare afterRejectStatus?: SysDelegationStatus;

  @BelongsTo(
    () => SysDelegationStatus,
    'afterDeclineStatusId',
  )
  declare afterDeclineStatus?: SysDelegationStatus;

  @BelongsTo(
    () => SysDelegationStatus,
    'afterRejectStatusId',
  )
  declare status?: SysDelegationStatus;
}
