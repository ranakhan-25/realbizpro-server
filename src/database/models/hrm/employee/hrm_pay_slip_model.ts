import {
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import { EmployeeList } from './hrm_employeeList_model';
import { SysOrganization } from 'src/database/models/system/sys_organization.model';

import type { PaySlipAttributes, PaySlipCreationAttributes } from '../../../types/payslip.types';

@Table({
  tableName: 'hrm_pay_slip',
  underscored: true,
  timestamps: true,
  paranoid: true,
  indexes: [
    {
      name: 'hrm_pay_slip_period_idx',
      fields: [
        'org_id',
        'period_year',
        'period_month',
      ],
    },
    {
      name: 'hrm_pay_slip_employee_idx',
      fields: ['employee_id'],
    },
    {
      name: 'hrm_pay_slip_unique_period_employee',
      unique: true,
      fields: [
        'org_id',
        'employee_id',
        'period_year',
        'period_month',
      ],
    },
  ],
})
export class PaySlip extends BaseModel<PaySlipAttributes, PaySlipCreationAttributes> {
  @ForeignKey(() => EmployeeList)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'employee_id',
  })
  declare employeeId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'employee_code',
  })
  declare employeeCode: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'employee_name',
  })
  declare employeeName: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
    field: 'period_month',
  })
  declare month: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'period_year',
  })
  declare year: number;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'gross_salary',
  })
  declare grossSalary: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'working_days',
  })
  declare workingDays: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'absent_days',
  })
  declare absentDays: number;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'absent_amount',
  })
  declare absentAmount: number;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare deduction: number;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'net_salary',
  })
  declare netSalary: number;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'bank_payable_amount',
  })
  declare bankPayableAmount: number;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'cash_payable_amount',
  })
  declare cashPayableAmount: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 'Generated',
  })
  declare status: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    field: 'generated_at',
  })
  declare generatedAt: Date;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'created_by',
  })
  declare createdBy?: string;

  @ForeignKey(() => SysOrganization)
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    field: 'org_id',
  })
  declare orgId?: number | null;
}
