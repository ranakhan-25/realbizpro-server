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
import { SysModules } from './sys_module.model';

import type {
  SysMenuAttributes,
  SysMenuCreationAttributes,
} from '../../types/sysmenu.types';
import { SysMenuPermission } from './sys_menu_permission.model';
import { SysPermission } from './sys_permission.model';

export enum SysMenuLocation {
  HEADER = 'HEADER',
  FOOTER = 'FOOTER',
  SIDEBAR = 'SIDEBAR',
  NOTFOUND = 'NOTFOUND',
}

@Table({
  tableName: 'sys_menus',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class SysMenu extends BaseModel<
  SysMenuAttributes,
  SysMenuCreationAttributes
> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare title: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare url: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: '_self',
  })
  declare target: string;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    defaultValue: [SysMenuLocation.SIDEBAR],
    validate: {
      isValidLocations(value: string[]) {
        if (!Array.isArray(value)) {
          throw new Error(
            'Location must be an array',
          );
        }
        const validLocations = Object.values(
          SysMenuLocation,
        );
        if (
          !value.every((loc) =>
            validLocations.includes(
              loc as SysMenuLocation,
            ),
          )
        ) {
          throw new Error(
            'Invalid location value',
          );
        }
      },
    },
  })
  declare location: (
    | 'HEADER'
    | 'FOOTER'
    | 'SIDEBAR'
    | 'NOTFOUND'
  )[];

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    defaultValue: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m560-240-56-58 142-142H160v-80h486L504-662l56-58 240 240-240 240Z"/></svg>`,
  })
  declare icon?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare elementClass?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare elementId?: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  declare order: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description?: string;

  @ForeignKey(() => SysMenu)
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  declare parentId?: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  declare isVisible: boolean;

  @ForeignKey(() => SysModules)
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  declare moduleId?: number;

  // Self-referencing relationships
  @BelongsTo(() => SysMenu, 'parentId')
  declare parent?: SysMenu;

  @HasMany(() => SysMenu, 'parentId')
  declare children?: SysMenu[];

  // Belongs to module
  @BelongsTo(() => SysModules, 'moduleId')
  declare module?: SysModules;

  // Many-to-many with permissions through MenuPermission
  @BelongsToMany(
    () => SysPermission,
    () => SysMenuPermission,
  )
  declare permissions?: SysPermission[];

  // Has many menu-permission assignments
  @HasMany(() => SysMenuPermission, 'menuId')
  declare menuPermissions?: SysMenuPermission[];
}
