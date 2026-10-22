/* eslint-disable prettier/prettier */
import type {
  AttendanceReconciliationAttributes,
  AttendanceReconciliationCreationAttributes,
} from '../../../types/attendancereconciliation.types';

/* eslint-disable prettier/prettier */
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import { EmployeeList } from '../employee/hrm_employeeList_model';

export enum AttendanceReconciliationRequestType {
  IGNORE_LATE = 'Ignore Late',
  ADJUST_WITH_LEAVE = 'Adjust With Leave',
  HALF_DAY_TO_FULL_DAY = 'Half Day to Full Day',
  MANUAL_ATTENDANCE_REQUEST = 'Manual Attendance Request',
  OTHER = 'Other',
}

export enum AttendanceReconciliationStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
}

@Table({
  tableName: 'attendance_reconciliation',
  timestamps: true,
  paranoid: true,
  underscored: false,
  indexes: [
    {
      name: 'AttendanceReconciliation_employeeId_idx',
      fields: ['employeeId'],
    },
    {
      name: 'AttendanceReconciliation_date_idx',
      fields: ['date'],
    },
    {
      name: 'AttendanceReconciliation_status_idx',
      fields: ['status'],
    },
    {
      name: 'AttendanceReconciliation_requestType_idx',
      fields: ['requestType'],
    },
    {
      name: 'AttendanceReconciliation_deletedAt_idx',
      fields: ['deleted_at'],
    },
  ],
})
export class AttendanceReconciliation extends BaseModel<
  AttendanceReconciliationAttributes,
  AttendanceReconciliationCreationAttributes
> {
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
    type: DataType.DATEONLY,
    allowNull: false,
  })
  declare date: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  declare lateMinutes: number;

  @Column({
    type: DataType.ENUM(
      ...Object.values(
        AttendanceReconciliationRequestType,
      ),
    ),
    allowNull: false,
  })
  declare requestType: AttendanceReconciliationRequestType;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare reason?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare attachment?: string;

  @Column({
    type: DataType.ENUM(
      ...Object.values(
        AttendanceReconciliationStatus,
      ),
    ),
    allowNull: false,
    defaultValue:
      AttendanceReconciliationStatus.PENDING,
  })
  declare status: AttendanceReconciliationStatus;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare approvedBy?: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare isApproved: boolean;

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
