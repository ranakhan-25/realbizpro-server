import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import type {
  SysUserDelegationAttributes,
  SysUserDelegationCreationAttributes,
} from '../../types/sysuserdelegation.types';
import { SysUser } from '../system/sys_user.model';
import { SysApprovalWorkflow } from './sys_approval_workflows.model';

@Table({
  tableName: 'sys_user_delegations',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class SysUserDelegation extends BaseModel<
  SysUserDelegationAttributes,
  SysUserDelegationCreationAttributes
> {
  @ForeignKey(() => SysUser)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    field: 'delegator_id',
  })
  declare delegatorId: number;

  @ForeignKey(() => SysUser)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    field: 'delegate_id',
  })
  declare delegateId: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'start_at',
  })
  declare startAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'end_at',
  })
  declare endAt: Date;

  @ForeignKey(() => SysApprovalWorkflow)
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    field: 'workflow_id',
  })
  declare workflowId?: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare reason?: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    defaultValue: 'ACTIVE',
  })
  declare status: string;

  @BelongsTo(() => SysUser, 'delegatorId')
  declare delegator?: SysUser;

  @BelongsTo(() => SysUser, 'delegateId')
  declare delegate?: SysUser;

  @BelongsTo(
    () => SysApprovalWorkflow,
    'workflowId',
  )
  declare workflow?: SysApprovalWorkflow;
}
