import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { SysMenu } from './sys_menu.model';
import { SysPermission } from './sys_permission.model';
import type {
  SysMenuPermissionAttributes,
  SysMenuPermissionCreationAttributes,
} from '../../types/sysmenupermission.types';

@Table({
  tableName: 'sys_menu_permissions',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class SysMenuPermission extends BaseModel<
  SysMenuPermissionAttributes,
  SysMenuPermissionCreationAttributes
> {
  @ForeignKey(() => SysMenu)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  declare menuId: number;

  @ForeignKey(() => SysPermission)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  declare permissionId: number;

  // Relationships
  @BelongsTo(() => SysMenu, 'menuId')
  declare menu?: SysMenu;

  @BelongsTo(() => SysPermission, 'permissionId')
  declare permission?: SysPermission;
}
