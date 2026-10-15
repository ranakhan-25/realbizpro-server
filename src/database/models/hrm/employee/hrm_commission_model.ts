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
  CommissionAttributes,
  CommissionCreationAttributes,
  CommissionUpdateAttributes,
} from 'src/database/types/commission.types';
import { EmployeeList } from './hrm_employeeList_model';

@Table({
  tableName: 'commission',
  timestamps: true,
  paranoid: true,
  underscored: false,
  indexes: [
    {
      name: 'Commission_employeeId_idx',
      fields: ['employeeId'],
    },
    {
      name: 'Commission_deletedAt_idx',
      fields: ['deleted_at'],
    },
  ],
})
export class Commission
  extends BaseModel<
    CommissionUpdateAttributes,
    CommissionCreationAttributes
  >
  implements CommissionAttributes
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
    allowNull: true,
  })
  declare type?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare commissionType?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare title: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare value?: string;

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
