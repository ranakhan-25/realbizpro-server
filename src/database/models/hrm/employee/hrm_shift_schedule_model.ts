import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import type {
  ShiftScheduleAttributes,
  ShiftScheduleCreationAttributes,
  ShiftScheduleUpdateAttributes,
} from 'src/database/types/shiftschedule.types';
import { Shift } from './hrm_shift_model';

export enum ShiftDayName {
  SATURDAY = 'Saturday',
  SUNDAY = 'Sunday',
  MONDAY = 'Monday',
  TUESDAY = 'Tuesday',
  WEDNESDAY = 'Wednesday',
  THURSDAY = 'Thursday',
  FRIDAY = 'Friday',
}

@Table({
  tableName: 'shift_schedule',
  timestamps: true,
  paranoid: true,
  underscored: false,
  indexes: [
    {
      name: 'ShiftSchedule_shiftId_idx',
      fields: ['shiftId'],
    },
    {
      name: 'ShiftSchedule_deletedAt_idx',
      fields: ['deleted_at'],
    },
  ],
})
export class ShiftSchedule
  extends BaseModel<
    ShiftScheduleUpdateAttributes,
    ShiftScheduleCreationAttributes
  >
  implements ShiftScheduleAttributes
{
  @ForeignKey(() => Shift)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    references: {
      model: 'shift',
      key: 'uuid',
    },
  })
  declare shiftId: string;

  @BelongsTo(() => Shift, {
    foreignKey: 'shiftId',
    targetKey: 'uuid',
    as: 'shift',
  })
  declare shift?: Shift;

  @Column({
    type: DataType.ENUM(
      ...Object.values(ShiftDayName),
    ),
    allowNull: false,
  })
  declare day: ShiftDayName;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  declare enabled: boolean;

  @Column({
    type: DataType.TIME,
    allowNull: true,
  })
  declare fromTime?: string;

  @Column({
    type: DataType.TIME,
    allowNull: true,
  })
  declare toTime?: string;

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
