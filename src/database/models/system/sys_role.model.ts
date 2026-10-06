// Role.model.ts
import {
  BelongsToMany,
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { SysPermission } from './sys_permission.model';
import { SysRolePermission } from './sys_role_permission.model';
import { SysUser } from './sys_user.model';
import { SysUserRole } from './sys_user_role.model';
import type {
  SysRoleAttributes,
  SysRoleCreationAttributes,
} from '../../types/sysrole.types';

@Table({
  tableName: 'sys_roles',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [{ fields: ['name'], unique: true }],
})
export class SysRole extends BaseModel<
  SysRoleAttributes,
  SysRoleCreationAttributes
> {
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: true,
  })
  declare name: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: true,
  })
  declare slug: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description?: string;

  // FIXED: Use only BelongsToMany for many-to-many relationships
  @BelongsToMany(() => SysUser, {
    through: () => SysUserRole,
    foreignKey: 'role_id', // Make sure this matches your UserRole table column
    otherKey: 'user_id', // Make sure this matches your UserRole table column
    as: 'users',
  })
  declare users?: SysUser[];

  @BelongsToMany(() => SysPermission, {
    through: () => SysRolePermission,
    foreignKey: 'role_id', // Make sure this matches your RolePermission table column
    otherKey: 'permission_id', // Make sure this matches your RolePermission table column
    as: 'permissions',
  })
  declare permissions?: SysPermission[];
}
