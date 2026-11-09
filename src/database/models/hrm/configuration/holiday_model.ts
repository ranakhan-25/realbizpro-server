import {
  Column,
  DataType,
  Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';

import type {
  HolidayAttributes,
  HolidayCreationAttributes,
} from '../../../types/holiday.types';
import { SysOrganization } from "src/database/models/system/sys_organization.model";

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
}
