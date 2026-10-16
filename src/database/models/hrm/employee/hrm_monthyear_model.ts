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

  @HasMany(() => Attendance, {
    foreignKey: 'monthYearId',
    sourceKey: 'uuid',
    as: 'attendances',
  })
  declare attendances?: Attendance[];
}
