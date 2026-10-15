/* eslint-disable prettier/prettier */
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';

import type {
  LoanAttributes,
  LoanCreationAttributes,
  LoanUpdateAttributes,
} from 'src/database/types/loan.types';
import { EmployeeList } from './hrm_employeeList_model';

@Table({
  tableName: 'loan',
  timestamps: true,
  paranoid: true,
  underscored: false,
  indexes: [
    {
      name: 'Loan_employeeId_idx',
      fields: ['employeeId'],
    },
    {
      name: 'Loan_deletedAt_idx',
      fields: ['deleted_at'],
    },
  ],
})
export class Loan
  extends BaseModel<
    LoanUpdateAttributes,
    LoanCreationAttributes
  >
  implements LoanAttributes
{
  @ForeignKey(() => EmployeeList)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare employeeId: string;

  @BelongsTo(() => EmployeeList, {
    foreignKey: 'employeeId',
    targetKey: 'uuid',
    as: 'employee',
  })
  declare employee?: EmployeeList;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare type: string;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
  })
  declare amount: number;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  declare startDate: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  declare endDate?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare addedById?: string;

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
