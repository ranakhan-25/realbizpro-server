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
  AllowanceAttributes,
  AllowanceCreationAttributes,
  AllowanceUpdateAttributes,
} from 'src/database/types/allowance.types';
import { EmployeeList } from './hrm_employeeList_model';
import {
  AllowanceType,
  PaymentType,
} from './hrm_payment_enum';

@Table({
  tableName: 'allowance',
  timestamps: true,
  paranoid: true,
  underscored: false,
  indexes: [
    {
      name: 'Allowance_employeeId_idx',
      fields: ['employeeId'],
    },
    {
      name: 'Allowance_deletedAt_idx',
      fields: ['deleted_at'],
    },
  ],
})
export class Allowance
  extends BaseModel<
    AllowanceUpdateAttributes,
    AllowanceCreationAttributes
  >
  implements AllowanceAttributes
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
  declare purpose: string;

  @Column({
    type: DataType.ENUM(
      ...Object.values(AllowanceType),
    ),
    allowNull: false,
  })
  declare type: AllowanceType;

  @Column({
    type: DataType.ENUM(
      ...Object.values(PaymentType),
    ),
    allowNull: false,
  })
  declare paymentType: PaymentType;

  @Column({
    type: DataType.DECIMAL(8, 2),
    allowNull: true,
  })
  declare percentage?: number;

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
