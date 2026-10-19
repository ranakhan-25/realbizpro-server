/* eslint-disable prettier/prettier */
import type {
  LeaveTypeAttributes,
  LeaveTypeCreationAttributes,
} from '../../../types/leavetype.types';

/* eslint-disable prettier/prettier */
import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';

export enum LeaveTypeStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Table({
  tableName: 'leave_type',
  timestamps: true,
  paranoid: true,
  underscored: false,
  indexes: [
    {
      name: 'LeaveType_name_idx',
      fields: ['name'],
    },
    {
      name: 'LeaveType_status_idx',
      fields: ['status'],
    },
    {
      name: 'LeaveType_deletedAt_idx',
      fields: ['deleted_at'],
    },
  ],
})
export class LeaveType extends BaseModel<
  LeaveTypeAttributes,
  LeaveTypeCreationAttributes
> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  declare allocationDay: number;

  @Column({
    type: DataType.ENUM(
      ...Object.values(LeaveTypeStatus),
    ),
    allowNull: false,
    defaultValue: LeaveTypeStatus.ACTIVE,
  })
  declare status: LeaveTypeStatus;

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
