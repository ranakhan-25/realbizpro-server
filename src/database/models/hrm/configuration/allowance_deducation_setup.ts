/* eslint-disable prettier/prettier */
import type {
  AllowanceDeductionSetupAttributes,
  AllowanceDeductionSetupCreationAttributes,
} from '../../../types/allowancedeductionsetup.types';

/* eslint-disable prettier/prettier */
import {
  Column,
  DataType,
  Table,
  HasMany,
} from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import { SalaryGradeItem } from './hrm_salary_grade_item_model';

// পাথ ঠিক করে দিন

export enum SetupTypeEnum {
  ALLOWANCE = 'Allowance',
  DEDUCTION = 'Deduction',
}

export enum PaymentTypeEnum {
  MONTHLY = 'Monthly',
  DAILY = 'Daily',
}

@Table({
  tableName: 'allowance_deduction_setup',
  timestamps: true,
  paranoid: true,
})
export class AllowanceDeductionSetup extends BaseModel<
  AllowanceDeductionSetupAttributes,
  AllowanceDeductionSetupCreationAttributes
> {
  @Column({
    type: DataType.ENUM(
      ...Object.values(SetupTypeEnum),
    ),
    allowNull: false,
  })
  declare type: SetupTypeEnum;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string; // House Rent, Provident Fund etc.

  @Column({
    type: DataType.ENUM(
      ...Object.values(PaymentTypeEnum),
    ),
    allowNull: false,
  })
  declare paymentType: PaymentTypeEnum;

  // ✅ নতুন রিলেশন: একটির অধীনে অনেক SalaryGradeItem থাকতে পারে
  @HasMany(() => SalaryGradeItem, {
    foreignKey: 'setupId',
    as: 'gradeItems',
  })
  declare gradeItems?: SalaryGradeItem[];

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
}
