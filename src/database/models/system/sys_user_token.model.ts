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
  SysUserTokenAttributes,
  SysUserTokenCreationAttributes,
} from '../../types/sysusertoken.types';

@Table({
  tableName: 'sys_user_tokens',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [
    { fields: ['jti'], unique: true },
    { fields: ['user_id'] },
  ],
})
export class SysUserToken extends BaseModel<
  SysUserTokenAttributes,
  SysUserTokenCreationAttributes
> {
  @ForeignKey(() => SysUser)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    field: 'user_id',
  })
  declare userId: number;

  @BelongsTo(() => SysUser, 'userId')
  declare user?: SysUser;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare token: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    unique: true,
  })
  declare jti: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
    field: 'ip_address',
  })
  declare ipAddress?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'user_agent',
  })
  declare userAgent?: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'expires_at',
  })
  declare expiresAt: Date;
}
