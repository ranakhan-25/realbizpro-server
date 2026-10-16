/* eslint-disable prettier/prettier */

import {
  Column,
  DataType,
  Table,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';

import { BaseModel } from 'src/database/base.model';
import {
  AttendanceAttributes,
  AttendanceCreationAttributes,
} from 'src/database/types/attendance.types';
// import { Employee } from './hrm_employee_model';
import { MonthYear } from './hrm_monthyear_model';
import { EmployeeList } from './hrm_employeeList_model';

export enum AttendanceType {
  WORKDAY = 'workday',
  WEEKEND = 'weekend',
  HOLIDAY = 'holiday',
  OFFDAY = 'offday',
}

@Table({
  tableName: 'attendance',
  timestamps: true,
  paranoid: true,
  indexes: [
    {
      name: 'Attendance_date_idx',
      fields: ['date'],
    },
    {
      name: 'Attendance_employeeId_idx',
      fields: ['employeeId'],
    },
    {
      name: 'Attendance_monthYearId_idx',
      fields: ['monthYearId'],
    },
  ],
})
export class Attendance extends BaseModel<
  AttendanceAttributes,
  AttendanceCreationAttributes
> {
  @ForeignKey(() => EmployeeList)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare employeeId: string;

  @ForeignKey(() => MonthYear)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare monthYearId?: string | null;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  declare date: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare day: string;

  @Column({
    type: DataType.TIME,
    allowNull: true,
  })
  declare inTime?: string;

  @Column({
    type: DataType.TIME,
    allowNull: true,
  })
  declare outTime?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare note?: string;

  @Column({
    type: DataType.ENUM(
      ...Object.values(AttendanceType),
    ),
    allowNull: false,
    defaultValue: AttendanceType.WORKDAY,
  })
  declare type: AttendanceType;

  @BelongsTo(() => EmployeeList, {
    foreignKey: 'employeeId',
    targetKey: 'uuid',
    as: 'employee',
  })
  declare employee?: EmployeeList;

  @BelongsTo(() => MonthYear, {
    foreignKey: 'monthYearId',
    targetKey: 'uuid',
    as: 'monthYear',
  })
  declare monthYear?: MonthYear;
}
