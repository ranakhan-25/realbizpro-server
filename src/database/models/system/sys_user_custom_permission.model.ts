import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { SysUser } from './sys_user.model';
import { SysCustomPermission } from './sys_custom_permission.model';

import type { SysUserCustomPermissionAttributes, SysUserCustomPermissionCreationAttributes } from '../../types/sysusercustompermission.types';

@Table({
  tableName: 'sys_user_custom_permissions',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [
    { fields: ['user_id', 'custom_permission_id'], unique: true },
    { fields: ['user_id'] },
    { fields: ['custom_permission_id'] },
  ],
})
export class SysUserCustomPermission extends BaseModel<SysUserCustomPermissionAttributes, SysUserCustomPermissionCreationAttributes> {
  @ForeignKey(() => SysUser)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    field: 'user_id',
  })
  declare userId: number;

  @ForeignKey(() => SysCustomPermission)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    field: 'custom_permission_id',
  })
  declare customPermissionId: number;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
    defaultValue: 'DENY',
    field: 'effect',
    comment: 'DENY explicitly forbids this permission even if base role permits it. ALLOW explicitly grants it.',
  })
  declare effect: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'reason',
  })
  declare reason?: string;

  @BelongsTo(() => SysUser, {
    foreignKey: 'user_id',
    as: 'user',
  })
  declare user?: SysUser;

  @BelongsTo(() => SysCustomPermission, {
    foreignKey: 'custom_permission_id',
    as: 'customPermission',
  })
  declare customPermission?: SysCustomPermission;
}
