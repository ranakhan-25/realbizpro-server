/* eslint-disable prettier/prettier */
import type {
  SalaryGradeItemAttributes,
  SalaryGradeItemCreationAttributes,
} from '../../../types/salarygradeitem.types';

/* eslint-disable prettier/prettier */
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';

import { AllowanceDeductionSetup } from '../configuration/allowance_deducation_setup';

export enum SalaryGradeItemType {
  ALLOWANCE = 'Allowance',
  DEDUCTION = 'Deduction',
}

@Table({
  tableName: 'salary_grade_item',
  timestamps: true,
  paranoid: true,
  indexes: [
    {
      name: 'SalaryGradeItem_setupId_idx',
      fields: ['setupId'],
    },
    {
      name: 'SalaryGradeItem_deletedAt_idx',
      fields: ['deleted_at'],
    },
  ],
})
export class SalaryGradeItem extends BaseModel<
  SalaryGradeItemAttributes,
  SalaryGradeItemCreationAttributes
> {
  // ✅ Allowance Deduction Setup এর সাথে রিলেশন
  @ForeignKey(() => AllowanceDeductionSetup)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare setupId?: string;

  @BelongsTo(() => AllowanceDeductionSetup, {
    foreignKey: 'setupId',
    targetKey: 'uuid',
    as: 'setup',
  })
  declare setup?: AllowanceDeductionSetup;

  // ✅ নতুন ফিল্ড: Basic Salary
  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare basicSalary: number;

  @Column({
    type: DataType.ENUM(
      ...Object.values(SalaryGradeItemType),
    ),
    allowNull: false,
  })
  declare type: SalaryGradeItemType;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.DECIMAL(8, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare percent: number;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare amount: number;

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
