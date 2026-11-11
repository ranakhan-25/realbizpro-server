/* eslint-disable prettier/prettier */
import type {
  ZkTecoDeviceAttributes,
  ZkTecoDeviceCreationAttributes,
} from '../../../types/zktecodevice.types';

/* eslint-disable prettier/prettier */
import {
  Column,
  DataType,
  Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import { SysOrganization } from "src/database/models/system/sys_organization.model";
import { Project } from "src/database/models/projects/project/pr_project.model";

export enum ZkTecoDeviceType {
  ADMS = 'ADMS',
  REAL_IP = 'Real IP',
}

export enum ZkTecoDeviceStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Table({
  tableName: 'hrm_zkteco_device',
  underscored: true,
  timestamps: true,
  paranoid: true,
  indexes: [
    {
      name: 'ZkTecoDevice_name_idx',
      fields: ['name'],
    },
    {
      name: 'ZkTecoDevice_sn_idx',
      fields: ['sn'],
    },
    {
      name: 'ZkTecoDevice_type_idx',
      fields: ['type'],
    },
    {
      name: 'ZkTecoDevice_status_idx',
      fields: ['status'],
    },
    {
      name: 'ZkTecoDevice_deletedAt_idx',
      fields: ['deleted_at'],
    },
  ],
})
export class ZkTecoDevice extends BaseModel<
  ZkTecoDeviceAttributes,
  ZkTecoDeviceCreationAttributes
> {
  @Column({
    type: DataType.ENUM(
      ...Object.values(ZkTecoDeviceType),
    ),
    allowNull: false,
  })
  declare type: ZkTecoDeviceType;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare sn: string; // Device SN / SN NO

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare ip?: string; // Only for Real IP type

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare port?: string; // Only for Real IP type

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare lastOnline?: Date;

  @Column({
    type: DataType.ENUM(
      ...Object.values(ZkTecoDeviceStatus),
    ),
    allowNull: false,
    defaultValue: ZkTecoDeviceStatus.ACTIVE,
  })
  declare status: ZkTecoDeviceStatus;

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
