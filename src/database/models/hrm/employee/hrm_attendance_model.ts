import {
  Column,
  DataType,
  Table,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import { EmployeeList } from './hrm_employeeList_model';
import { MonthYear } from './hrm_monthyear_model';
import { Department } from './hrm_department_model';
import { Shift } from './hrm_shift_model';

import type {
  AttendanceAttributes,
  AttendanceCreationAttributes,
} from '../../../types/attendance.types';
import { SysOrganization } from "src/database/models/system/sys_organization.model";
import { Project } from "src/database/models/projects/project/pr_project.model";

export enum AttendanceType {
  WORKDAY = 'workday',
  WEEKEND = 'weekend',
  HOLIDAY = 'holiday',
  OFFDAY = 'offday',
}

@Table({
  tableName: 'attendance',
  timestamps: true,
  paranoid: true,
  underscored: false,
  indexes: [
    {
      name: 'Attendance_date_idx',
      fields: ['date'],
    },
    {
      name: 'Attendance_employeeId_idx',
      fields: ['employeeId'],
    },
    {
      name: 'Attendance_monthYearId_idx',
      fields: ['monthYearId'],
    },
    {
      name: 'Attendance_departmentId_idx',
      fields: ['departmentId'],
    },
    {
      name: 'Attendance_shiftId_idx',
      fields: ['shiftId'],
    },
    {
      name: 'Attendance_employeeId_date_idx',
      fields: ['employeeId', 'date'],
      unique: true,
    },
    {
      name: 'Attendance_deletedAt_idx',
      fields: ['deleted_at'],
    },
  ],
})
export class Attendance extends BaseModel<
  AttendanceAttributes,
  AttendanceCreationAttributes
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

  @ForeignKey(() => MonthYear)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare monthYearId?: string | null;

  @BelongsTo(() => MonthYear, {
    foreignKey: 'monthYearId',
    targetKey: 'uuid',
    as: 'monthYear',
  })
  declare monthYear?: MonthYear;

  @ForeignKey(() => Department)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare departmentId?: string;

  @BelongsTo(() => Department, {
    foreignKey: 'departmentId',
    targetKey: 'uuid',
    as: 'department',
  })
  declare department?: Department;

  @ForeignKey(() => Shift)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare shiftId?: string;

  @BelongsTo(() => Shift, {
    foreignKey: 'shiftId',
    targetKey: 'uuid',
    as: 'shift',
  })
  declare shift?: Shift;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  declare date: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare day: string;

  @Column({
    type: DataType.TIME,
    allowNull: true,
  })
  declare inTime?: string;

  @Column({
    type: DataType.TIME,
    allowNull: true,
  })
  declare outTime?: string;

  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: true,
    defaultValue: 0,
  })
  declare hours?: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare inSelfie?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare outSelfie?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare inLocation?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare outLocation?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare location?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare note?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare comment?: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare isPresent: boolean;

  @Column({
    type: DataType.ENUM(
      ...Object.values(AttendanceType),
    ),
    allowNull: false,
    defaultValue: AttendanceType.WORKDAY,
  })
  declare type: AttendanceType;

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
