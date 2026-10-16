/* eslint-disable prettier/prettier */

import {
  Column,
  DataType,
  Table,
  HasMany,
} from 'sequelize-typescript';

import { BaseModel } from 'src/database/base.model';
import {
  EmployeeAttributes,
  EmployeeCreationAttributes,
} from 'src/database/types/employee.types';
import { Attendance } from './hrm_attendance_model';
import { BonusGenerate } from './hrm_bonus_generate_model';

export enum EmployeeStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Table({
  tableName: 'employee',
  timestamps: true,
  paranoid: true,
  indexes: [
    {
      name: 'Employee_name_idx',
      fields: ['name'],
    },
    {
      name: 'Employee_employeeCode_idx',
      fields: ['employeeCode'],
    },
  ],
})
export class Employee extends BaseModel<
  EmployeeAttributes,
  EmployeeCreationAttributes
> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare employeeCode: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.ENUM(
      ...Object.values(EmployeeStatus),
    ),
    allowNull: false,
    defaultValue: EmployeeStatus.ACTIVE,
  })
  declare status: EmployeeStatus;

  @HasMany(() => Attendance, {
    foreignKey: 'employeeId',
    sourceKey: 'uuid',
    as: 'attendances',
  })
  declare attendances?: Attendance[];
  @HasMany(() => BonusGenerate, {
    foreignKey: 'employeeId',
    sourceKey: 'uuid',
    as: 'bonusGenerates',
  })
  declare bonusGenerates?: BonusGenerate[];
}
