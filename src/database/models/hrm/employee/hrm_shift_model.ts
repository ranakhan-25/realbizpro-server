import {
  Column,
  DataType,
  HasMany,
  Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import type {
  ShiftAttributes,
  ShiftCreationAttributes,
  ShiftUpdateAttributes,
} from 'src/database/types/shift.types';
import { ShiftSchedule } from './hrm_shift_schedule_model';
import { Attendance } from './hrm_attendance_model';
import { SysOrganization } from "src/database/models/system/sys_organization.model";

export enum ShiftStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Table({
  tableName: 'hrm_shift',
  underscored: true,
  timestamps: true,
  paranoid: true,
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
  @HasMany(() => Attendance, {
    foreignKey: 'shiftId',
    sourceKey: 'uuid',
    as: 'attendances',
  })
  declare attendances?: Attendance[];
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
}
