/* eslint-disable prettier/prettier */

import {
  Column,
  DataType,
  Table,
  HasMany,
} from 'sequelize-typescript';

import { BaseModel } from 'src/database/base.model';
import {
  MonthYearAttributes,
  MonthYearCreationAttributes,
} from 'src/database/types/monthyear.types';
import { Attendance } from './hrm_attendance_model';

@Table({
  tableName: 'month_year',
  timestamps: true,
  paranoid: true,
  indexes: [
    {
      name: 'MonthYear_month_year_idx',
      fields: ['month', 'year'],
      unique: true,
    },
    {
      name: 'MonthYear_startDate_idx',
      fields: ['startDate'],
    },
    {
      name: 'MonthYear_endDate_idx',
      fields: ['endDate'],
    },
  ],
})
export class MonthYear extends BaseModel<
  MonthYearAttributes,
  MonthYearCreationAttributes
> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare month: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare year: number;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  declare startDate: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  declare endDate: string;

  @HasMany(() => Attendance, {
    foreignKey: 'monthYearId',
    sourceKey: 'uuid',
    as: 'attendances',
  })
  declare attendances?: Attendance[];
}
