// Role.model.ts
import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { SysPermission } from './sys_permission.model';
import { SysRolePermission } from './sys_role_permission.model';
import { SysUser } from './sys_user.model';
import { SysUserRole } from './sys_user_role.model';
import { SysOrganization } from './sys_organization.model';
import { SysRoleFeature } from './sys_role_feature.model';
import type {
  SysRoleAttributes,
  SysRoleCreationAttributes,
} from '../../types/sysrole.types';

@Table({
  tableName: 'sys_roles',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [
    { fields: ['name'], unique: true },
    { fields: ['org_id'] },
  ],
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

  @ForeignKey(() => SysOrganization)
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    field: 'org_id',
    comment: 'Null for system-level roles (e.g. Super Admin), set for tenant-specific roles',
  })
  declare orgId?: number;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'org_uuid',
  })
  declare orgUuid?: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_system_role',
  })
  declare isSystemRole: boolean;

  @BelongsTo(() => SysOrganization, 'org_id')
  declare organization?: SysOrganization;

  @HasMany(() => SysRoleFeature, 'role_id')
  declare roleFeatures?: SysRoleFeature[];

  // FIXED: Use only BelongsToMany for many-to-many relationships
  @BelongsToMany(() => SysUser, {
    through: () => SysUserRole,
    foreignKey: 'role_id',
    otherKey: 'user_id',
    as: 'users',
  })
  declare users?: SysUser[];

  @BelongsToMany(() => SysPermission, {
    through: () => SysRolePermission,
    foreignKey: 'role_id',
    otherKey: 'permission_id',
    as: 'permissions',
  })
  declare permissions?: SysPermission[];
}
