import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { SysUser } from './sys_user.model';

import type {
  SysNotificationAttributes,
  SysNotificationCreationAttributes,
} from '../../types/sysnotification.types';

@Table({
  tableName: 'sys_notifications',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [
    { fields: ['user_id'] },
    { fields: ['is_read'] },
    { fields: ['created_at'] },
  ],
})
export class SysNotification extends BaseModel<
  SysNotificationAttributes,
  SysNotificationCreationAttributes
> {
  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare message: string;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  declare data?: Record<string, any>;

  @ForeignKey(() => SysUser)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    field: 'user_id',
  })
  declare userId: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_read',
  })
  declare isRead: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'read_at',
  })
  declare readAt?: Date;

  @BelongsTo(() => SysUser)
  declare user: SysUser;
}
