import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { SysPermission } from './sys_permission.model';
import { SysRole } from './sys_role.model';
import type {
  SysRolePermissionAttributes,
  SysRolePermissionCreationAttributes,
} from '../../types/sysrolepermission.types';

@Table({
  tableName: 'sys_role_permissions',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [
    {
      fields: ['role_id', 'permission_id'],
      unique: true,
    },
    { fields: ['role_id'] },
    { fields: ['permission_id'] },
  ],
})
export class SysRolePermission extends BaseModel<
  SysRolePermissionAttributes,
  SysRolePermissionCreationAttributes
> {
  @ForeignKey(() => SysRole)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    field: 'role_id',
  })
  declare roleId: number;

  @ForeignKey(() => SysPermission)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    field: 'permission_id',
  })
  declare permissionId: number;

  // Relationships
  @BelongsTo(() => SysRole, 'roleId')
  declare role: SysRole;

  @BelongsTo(() => SysPermission, 'permissionId')
  declare permission: SysPermission;
}
