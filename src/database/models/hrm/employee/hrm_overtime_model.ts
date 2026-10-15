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
  OvertimeAttributes,
  OvertimeCreationAttributes,
  OvertimeUpdateAttributes,
} from 'src/database/types/overtime.types';
import { EmployeeList } from './hrm_employeeList_model';

@Table({
  tableName: 'overtime',
  timestamps: true,
  paranoid: true,
  underscored: false,
  indexes: [
    {
      name: 'Overtime_employeeId_idx',
      fields: ['employeeId'],
    },
    {
      name: 'Overtime_deletedAt_idx',
      fields: ['deleted_at'],
    },
  ],
})
export class Overtime
  extends BaseModel<
    OvertimeUpdateAttributes,
    OvertimeCreationAttributes
  >
  implements OvertimeAttributes
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
  declare title: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare type?: string;

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
