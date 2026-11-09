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
import { SysOrganization } from "src/database/models/system/sys_organization.model";
import { Project } from "src/database/models/projects/project/pr_project.model";

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
  tableName: 'hrm_attendance_reconciliation',
  underscored: true,
  timestamps: true,
  paranoid: true,
  indexes: [
    {
      name: 'AttendanceReconciliation_employeeId_idx',
      fields: ['employee_id'],
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
      fields: ['request_type'],
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
          field: 'created_by',
        })
  declare createdBy?: string;

  @Column({
          type: DataType.STRING,
          allowNull: true,
          field: 'updated_by',
        })
  declare updatedBy?: string;

  @Column({
          type: DataType.STRING,
          allowNull: true,
          field: 'deleted_by',
        })
  declare deletedBy?: string;
    @ForeignKey(() => SysOrganization)
    @Column({
            type: DataType.BIGINT,
            allowNull: true,
            field: 'org_id',
            defaultValue: null,
          })
    declare orgId?: number | null;
    @BelongsTo(() => SysOrganization, {
            foreignKey: 'orgId',
            targetKey: 'id',
            as: 'organization',
          })
    declare organization?: SysOrganization;
    @ForeignKey(() => Project)
    @Column({
            type: DataType.UUID,
            allowNull: true,
            field: 'project_id',
            defaultValue: null,
          })
    declare projectId?: string | null;
    @BelongsTo(() => Project, {
            foreignKey: 'projectId',
            targetKey: 'uuid',
            as: 'project',
          })
    declare project?: Project;
}
