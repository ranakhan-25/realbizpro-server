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
  HasMany, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import { SalaryGradeItem } from './hrm_salary_grade_item_model';
import { SysOrganization } from "src/database/models/system/sys_organization.model";

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
  tableName: 'hrm_allowance_deduction_setup',
  underscored: true,
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
          field: 'created_by',
        })
  declare createdBy?: string;

  @Column({
          type: DataType.STRING,
          allowNull: true,
          field: 'updated_by',
        })
  declare updatedBy?: string;
    @Column({
            type: DataType.STRING,
            allowNull: true,
            field: 'deleted_by',
          })
    declare deletedBy?: string;
    @ForeignKey(() => SysOrganization)
    @Column({
            type: DataType.BIGINT,
            allowNull: true,
            field: 'org_id',
            defaultValue: null,
          })
    declare orgId?: number | null;
    @BelongsTo(() => SysOrganization, {
            foreignKey: 'orgId',
            targetKey: 'id',
            as: 'organization',
          })
    declare organization?: SysOrganization;
}
