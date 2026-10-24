import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { SysUser } from './sys_user.model';
import { SysMenu } from './sys_menu.model';
import { SysModuleToUser } from './sys_module_to_user.model';
import { SysFeatures } from './sys_features.model';
import type {
  SysModulesAttributes,
  SysModulesCreationAttributes,
} from '../../types/sysmodules.types';

@Table({
  tableName: 'sys_modules',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [
    { fields: ['name'], unique: true },
    { fields: ['code'], unique: true },
  ],
})
export class SysModules extends BaseModel<
  SysModulesAttributes,
  SysModulesCreationAttributes
> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare name: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
    unique: true,
    field: 'code',
  })
  declare code?: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    field: 'path_route',
    comment: 'Frontend route matching path, e.g. /dashboard/crm',
  })
  declare pathRoute?: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
    field: 'icon',
  })
  declare icon?: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'display_order',
  })
  declare displayOrder: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_active',
  })
  declare isActive: boolean;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description?: string;

  // Has many menus
  @HasMany(() => SysMenu, 'moduleId')
  declare menus?: SysMenu[];

  // Has many features
  @HasMany(() => SysFeatures, 'module_id')
  declare features?: SysFeatures[];

  @BelongsToMany(() => SysUser, {
    through: () => SysModuleToUser,
    foreignKey: 'module_id',
    otherKey: 'user_id',
    as: 'users',
  })
  declare users?: SysUser[];
}
