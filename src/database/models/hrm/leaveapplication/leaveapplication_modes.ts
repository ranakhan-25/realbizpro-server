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
import { SysOrganization } from "src/database/models/system/sys_organization.model";
import { Project } from "src/database/models/projects/project/pr_project.model";

export enum LeaveApplicationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

@Table({
  tableName: 'hrm_leave_application',
  underscored: true,
  timestamps: true,
  paranoid: true,
  indexes: [
    {
      name: 'LeaveApplication_employeeId_idx',
      fields: ['employee_id'],
    },
    {
      name: 'LeaveApplication_leaveTypeId_idx',
      fields: ['leave_type_id'],
    },
    {
      name: 'LeaveApplication_status_idx',
      fields: ['status'],
    },
    {
      name: 'LeaveApplication_fromDate_idx',
      fields: ['from_date'],
    },
    {
      name: 'LeaveApplication_toDate_idx',
      fields: ['to_date'],
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
