/* eslint-disable prettier/prettier */

/* eslint-disable prettier/prettier */
import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import type {
  DeductionRuleAttributes,
  DeductionRuleCreationAttributes,
} from '../../../types/deductionrule.types';

export enum DeductionRuleType {
  LATE = 'Late',
  EARLY = 'Early',
}

@Table({
  tableName: 'deduction_rule',
  timestamps: true,
  paranoid: true,
  underscored: false,
  indexes: [
    {
      name: 'DeductionRule_type_idx',
      fields: ['type'],
    },
    {
      name: 'DeductionRule_title_idx',
      fields: ['title'],
    },
    {
      name: 'DeductionRule_deletedAt_idx',
      fields: ['deleted_at'],
    },
  ],
})
export class DeductionRule extends BaseModel<
  DeductionRuleAttributes,
  DeductionRuleCreationAttributes
> {
  @Column({
    type: DataType.ENUM(
      ...Object.values(DeductionRuleType),
    ),
    allowNull: false,
  })
  declare type: DeductionRuleType;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare title: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare lateTime: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare lateDays: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare deductionDays: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare createdBy?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare updatedBy?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare deletedBy?: string;
}
