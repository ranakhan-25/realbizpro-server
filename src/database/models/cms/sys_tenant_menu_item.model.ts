import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { SysOrganization } from '../system/sys_organization.model';
import { SysTenantMenu } from './sys_tenant_menu.model';

import type { SysTenantMenuItemAttributes, SysTenantMenuItemCreationAttributes } from '../../types/systenantmenuitem.types';

@Table({
  tableName: 'sys_tenant_menu_items',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class SysTenantMenuItem extends BaseModel<SysTenantMenuItemAttributes, SysTenantMenuItemCreationAttributes> {
  @ForeignKey(() => SysTenantMenu)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare menuId: number;

  @ForeignKey(() => SysOrganization)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare orgId: number;

  @ForeignKey(() => SysTenantMenuItem)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare parentId?: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare title: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: '/',
  })
  declare url: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: '_self',
  })
  declare target: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare icon?: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  declare orderIndex: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  declare isVisible: boolean;

  @BelongsTo(() => SysTenantMenu, 'menuId')
  declare menu?: SysTenantMenu;

  @BelongsTo(() => SysOrganization, 'orgId')
  declare organization?: SysOrganization;

  @BelongsTo(() => SysTenantMenuItem, 'parentId')
  declare parent?: SysTenantMenuItem;

  @HasMany(() => SysTenantMenuItem, 'parentId')
  declare children?: SysTenantMenuItem[];
}
