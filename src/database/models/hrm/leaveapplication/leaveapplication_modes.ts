/* eslint-disable prettier/prettier */
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';

import { LeaveType } from '../configuration/leave_type_list';
import {
  LeaveApplicationAttributes,
  LeaveApplicationCreationAttributes,
  LeaveApplicationUpdateAttributes,
} from 'src/database/types/leaveapplication.types';
import { EmployeeList } from '../employee/hrm_employeeList_model';

export enum LeaveApplicationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

@Table({
  tableName: 'leave_application',
  timestamps: true,
  paranoid: true,
  underscored: false,
  indexes: [
    {
      name: 'LeaveApplication_employeeId_idx',
      fields: ['employeeId'],
    },
    {
      name: 'LeaveApplication_leaveTypeId_idx',
      fields: ['leaveTypeId'],
    },
    {
      name: 'LeaveApplication_status_idx',
      fields: ['status'],
    },
    {
      name: 'LeaveApplication_fromDate_idx',
      fields: ['fromDate'],
    },
    {
      name: 'LeaveApplication_toDate_idx',
      fields: ['toDate'],
    },
    {
      name: 'LeaveApplication_deletedAt_idx',
      fields: ['deleted_at'],
    },
  ],
})
export class LeaveApplication
  extends BaseModel<
    LeaveApplicationUpdateAttributes,
    LeaveApplicationCreationAttributes
  >
  implements LeaveApplicationAttributes
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

  @ForeignKey(() => LeaveType)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare leaveTypeId: string;

  @BelongsTo(() => LeaveType, {
    foreignKey: 'leaveTypeId',
    targetKey: 'uuid',
    as: 'leaveType',
  })
  declare leaveType?: LeaveType;

  @Column({
    type: DataType.DECIMAL(8, 2),
    allowNull: true,
  })
  declare allocatedDays?: number;

  @Column({
    type: DataType.DECIMAL(8, 2),
    allowNull: true,
  })
  declare balanceDays?: number;

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
  declare reason: string;

  @Column({
    type: DataType.ENUM(
      ...Object.values(LeaveApplicationStatus),
    ),
    allowNull: false,
    defaultValue: LeaveApplicationStatus.PENDING,
  })
  declare status: LeaveApplicationStatus;

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
