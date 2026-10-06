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
  SysApprovalStepAttributes,
  SysApprovalStepCreationAttributes,
} from '../../types/sysapprovalstep.types';
import { SysApprovalWorkflow } from './sys_approval_workflows.model';
import { SysStepApprover } from './sys_step_approvers.model';

@Table({
  tableName: 'sys_approval_steps',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class SysApprovalStep extends BaseModel<
  SysApprovalStepAttributes,
  SysApprovalStepCreationAttributes
> {
  @ForeignKey(() => SysApprovalWorkflow)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  declare workflowId: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    comment: 'Step sequence: 1, 2, 3, ... N',
  })
  declare stepNumber: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  declare stepName?: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    comment: 'ANY / ALL / MAJORITY / CUSTOM',
  })
  declare ruleType: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    comment: 'Required count for ANY/CUSTOM',
  })
  declare requiredCount?: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare isFinal: boolean;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    comment: 'SLA in hours',
  })
  declare slaHours?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    comment: 'Escalation user ID if SLA exceeded',
  })
  declare escalationUserId?: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  declare isActive: boolean;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    comment: 'Escalation hours if SLA exceeded',
  })
  declare escalationHours?: number;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    comment:
      'Escalation to user ID if SLA exceeded',
  })
  declare escalationToUserId?: number;

  @BelongsTo(
    () => SysApprovalWorkflow,
    'workflowId',
  )
  declare workflow?: SysApprovalWorkflow;

  @HasMany(() => SysStepApprover)
  declare approvers?: SysStepApprover[];
}
