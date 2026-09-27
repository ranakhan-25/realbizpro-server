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
import type {
  SysModulesAttributes,
  SysModulesCreationAttributes,
} from '../../types/sysmodules.types';

@Table({
  tableName: 'sys_modules',
  timestamps: true,
  paranoid: true,
  underscored: true,
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
