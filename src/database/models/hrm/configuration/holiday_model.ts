import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';

import type {
  HolidayAttributes,
  HolidayCreationAttributes,
} from '../../../types/holiday.types';

export enum HolidayStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Table({
  tableName: 'holiday',
  timestamps: true,
  paranoid: true,
  underscored: false,
  indexes: [
    {
      name: 'Holiday_reason_idx',
      fields: ['reason'],
    },
    {
      name: 'Holiday_status_idx',
      fields: ['status'],
    },
    {
      name: 'Holiday_deletedAt_idx',
      fields: ['deleted_at'],
    },
  ],
})
export class Holiday extends BaseModel<
  HolidayAttributes,
  HolidayCreationAttributes
> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare reason: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  declare fromDate: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  declare toDate: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare description: string;

  @Column({
    type: DataType.ENUM(
      ...Object.values(HolidayStatus),
    ),
    allowNull: false,
    defaultValue: HolidayStatus.ACTIVE,
  })
  declare status: HolidayStatus;

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
