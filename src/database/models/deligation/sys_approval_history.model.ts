import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import type {
  SysApprovalHistoryAttributes,
  SysApprovalHistoryCreationAttributes,
} from '../../types/sysapprovalhistory.types';
import { SysUser } from '../system/sys_user.model';
import { SysApprovalRequest } from './sys_approval_requests.model';
import { SysApprovalStep } from './sys_approval_steps.model';
import { SysDelegationStatus } from './sys_delegation_statuses.model';
import { SysRequestAssignee } from './sys_request_assignees.model';

@Table({
  tableName: 'sys_approval_history',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class SysApprovalHistory extends BaseModel<
  SysApprovalHistoryAttributes,
  SysApprovalHistoryCreationAttributes
> {
  @ForeignKey(() => SysApprovalRequest)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    field: 'request_id',
  })
  declare requestId: number;

  @ForeignKey(() => SysApprovalStep)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    field: 'step_id',
  })
  declare stepId: number;

  @ForeignKey(() => SysDelegationStatus)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    field: 'action_status_id',
  })
  declare actionStatusId: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare comments?: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    field: 'ip_address',
  })
  declare ipAddress?: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    field: 'action_timestamp',
  })
  declare actionTimestamp: Date;

  @BelongsTo(
    () => SysApprovalRequest,
    'requestId',
  )
  declare request?: SysApprovalRequest;

  //add created_by relation with user
  @ForeignKey(() => SysUser)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    field: 'created_by',
  })
  declare createdBy: number;
  @BelongsTo(() => SysUser, 'createdBy')
  declare createdByUser: SysUser;

  @BelongsTo(() => SysApprovalStep, 'stepId')
  declare step?: SysApprovalStep;

  @BelongsTo(
    () => SysDelegationStatus,
    'actionStatusId',
  )
  declare actionStatus?: SysDelegationStatus;
}
