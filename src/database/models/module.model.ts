import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from '../base.model';
import { SysMenu } from './system/sys_menu.model';
import { SysUser } from './system/sys_user.model';
import { SysModuleToUser } from './system/sys_module_to_user.model';
import type {
  ModulesAttributes,
  ModulesCreationAttributes,
} from '../types/modules.types';

@Table({
  tableName: 'sys_modules',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class Modules extends BaseModel<
  ModulesAttributes,
  ModulesCreationAttributes
> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description?: string;

  // Has many menus
  @HasMany(() => SysMenu, 'moduleId')
  declare menus?: SysMenu[];

  @BelongsToMany(() => SysUser, {
    through: () => SysModuleToUser,
    foreignKey: 'module_id',
    otherKey: 'user_id',
    as: 'users',
  })
  declare users?: SysUser[];
}
