/* eslint-disable prettier/prettier */
import {
  Column,
  DataType,
  HasMany,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import type {
  ShiftAttributes,
  ShiftCreationAttributes,
  ShiftUpdateAttributes,
} from 'src/database/types/shift.types';
import { ShiftSchedule } from './hrm_shift_schedule_model';

export enum ShiftStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Table({
  tableName: 'shift',
  timestamps: true,
  paranoid: true,
  underscored: false,
  indexes: [
    {
      name: 'Shift_name_idx',
      fields: ['name'],
    },
    {
      name: 'Shift_deletedAt_idx',
      fields: ['deleted_at'],
    },
  ],
})
export class Shift
  extends BaseModel<
    ShiftUpdateAttributes,
    ShiftCreationAttributes
  >
  implements ShiftAttributes
{
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare name: string;

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

  @Column({
    type: DataType.ENUM(
      ...Object.values(ShiftStatus),
    ),
    allowNull: false,
    defaultValue: ShiftStatus.ACTIVE,
  })
  declare status: ShiftStatus;

  // relation: ek Shift er onek ShiftSchedule (1 : N)
  // foreignKey shiftId ShiftSchedule model e define kora ache
  @HasMany(() => ShiftSchedule, {
    foreignKey: 'shiftId',
    sourceKey: 'uuid',
    as: 'schedules',
  })
  declare schedules?: ShiftSchedule[];
}
