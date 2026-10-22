/* eslint-disable prettier/prettier */
import type {
  ZkTecoDeviceAttributes,
  ZkTecoDeviceCreationAttributes,
} from '../../../types/zktecodevice.types';

/* eslint-disable prettier/prettier */
import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';

export enum ZkTecoDeviceType {
  ADMS = 'ADMS',
  REAL_IP = 'Real IP',
}

export enum ZkTecoDeviceStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Table({
  tableName: 'zkteco_device',
  timestamps: true,
  paranoid: true,
  underscored: false,
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
