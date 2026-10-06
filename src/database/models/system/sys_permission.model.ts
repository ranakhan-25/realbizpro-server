// Permission.model.ts
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
import { SysMenu } from '../system/sys_menu.model';

import { SysFeatures } from './sys_features.model';
import { SysRole } from './sys_role.model';
import { SysRolePermission } from './sys_role_permission.model';
import { SysMenuPermission } from './sys_menu_permission.model';
import type {
  SysPermissionAttributes,
  SysPermissionCreationAttributes,
} from '../../types/syspermission.types';

export enum ActionType {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
}

export enum ContextTypes {
  OWN = 'own',
  ANY = 'any',
  TEAM = 'team',
  DEPARTMENT = 'department',
}

@Table({
  tableName: 'sys_permissions',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [{ fields: ['key'], unique: true }],
})
export class SysPermission extends BaseModel<
  SysPermissionAttributes,
  SysPermissionCreationAttributes
> {
  @Column({
    type: DataType.STRING(150),
    allowNull: false,
    unique: true,
  })
  declare key: string;

  //optional name
  @Column({
    type: DataType.STRING(150),
    allowNull: true,
  })
  declare name?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description?: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  declare resource: string;

  @Column({
    type: DataType.ENUM(
      ...Object.values(ActionType),
    ),
    allowNull: false,
  })
  declare action: ActionType;

  @Column({
    type: DataType.ENUM(
      ...Object.values(ContextTypes),
    ),
    allowNull: false,
  })
  declare context: ContextTypes;

  @ForeignKey(() => SysFeatures)
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    field: 'feature_id', // Make sure this matches your database column name
  })
  declare featureId?: number;

  // FIXED: Use only BelongsToMany for many-to-many relationship
  @BelongsToMany(() => SysRole, {
    through: () => SysRolePermission,
    foreignKey: 'permission_id', // Make sure this matches your RolePermission table column
    otherKey: 'role_id', // Make sure this matches your RolePermission table column
    as: 'roles',
  })
  declare roles?: SysRole[];

  // Belongs to Features
  @BelongsTo(() => SysFeatures, 'featureId')
  declare feature?: SysFeatures;

  @BelongsToMany(
    () => SysMenu,
    () => SysMenuPermission,
  )
  declare menus?: SysMenu[];

  // Has many menu-permission assignments
  @HasMany(
    () => SysMenuPermission,
    'permissionId',
  )
  declare menuPermissions?: SysMenuPermission[];
}
