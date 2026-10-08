import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import type {
  SysStepApproverAttributes,
  SysStepApproverCreationAttributes,
} from '../../types/sysstepapprover.types';
import { SysUser } from '../system/sys_user.model';
import { SysApprovalStep } from './sys_approval_steps.model';

export enum ApproverType {
  DEFAULT = 'DEFAULT',
  CONDITIONAL = 'CONDITIONAL',
  OVERRIDE = 'OVERRIDE',
}

export enum ConditionOperator {
  EQUALS = '=',
  GREATER_THAN = '>',
  LESS_THAN = '<',
  GREATER_THAN_OR_EQUALS = '>=',
  LESS_THAN_OR_EQUALS = '<=',
  IN = 'IN',
  BETWEEN = 'BETWEEN',
}

@Table({
  tableName: 'sys_step_approvers',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class SysStepApprover extends BaseModel<
  SysStepApproverAttributes,
  SysStepApproverCreationAttributes
> {
  @ForeignKey(() => SysApprovalStep)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  declare stepId: number;

  @ForeignKey(() => SysUser)
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    comment: 'Reference to SysUser.id',
  })
  declare userId?: number | null | undefined;
  @BelongsTo(() => SysUser, 'userId')
  declare user?: SysUser;

  @Column({
    type: DataType.ENUM(
      ...Object.values(ApproverType),
    ),
    allowNull: false,
    defaultValue: ApproverType.DEFAULT,
  })
  declare approverType: ApproverType;

  // Conditional / Override fields
  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    comment:
      'Condition field: department_id, amount, grade, buyer_id, etc.',
  })
  declare conditionField?: string;

  @Column({
    type: DataType.ENUM(
      ...Object.values(ConditionOperator),
    ),
    allowNull: true,
  })
  declare conditionOperator?: ConditionOperator;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment:
      'Condition value (can be JSON for IN/BETWEEN)',
  })
  declare conditionValue?: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 1,
    comment: 'Priority: lower = higher priority',
  })
  declare priority: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    comment:
      'Condition field table name if joins are required',
    field: 'condition_field_table_name',
  })
  declare conditionFieldTableName?: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    comment:
      'Condition field user field name if joins are required',
    field: 'condition_field_user_field_name',
  })
  declare conditionFieldUserFieldName?: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  declare isActive: boolean;

  @BelongsTo(() => SysApprovalStep, 'stepId')
  declare step?: SysApprovalStep;
}
