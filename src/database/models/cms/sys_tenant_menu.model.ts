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
import { SysTenantMenuItem } from './sys_tenant_menu_item.model';

import type { SysTenantMenuAttributes, SysTenantMenuCreationAttributes } from '../../types/systenantmenu.types';

export enum TenantMenuLocation {
  HEADER = 'HEADER',
  FOOTER = 'FOOTER',
  SIDEBAR = 'SIDEBAR',
  PORTAL = 'PORTAL',
}

@Table({
  tableName: 'sys_tenant_menus',
  timestamps: true,
  paranoid: false,
  underscored: true,
})
export class SysTenantMenu extends BaseModel<SysTenantMenuAttributes, SysTenantMenuCreationAttributes> {
  @ForeignKey(() => SysOrganization)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare orgId: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.ENUM(...Object.values(TenantMenuLocation)),
    allowNull: false,
    defaultValue: TenantMenuLocation.HEADER,
  })
  declare location: TenantMenuLocation;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  declare isActive: boolean;

  @BelongsTo(() => SysOrganization, 'orgId')
  declare organization?: SysOrganization;

  @HasMany(() => SysTenantMenuItem, 'menuId')
  declare items?: SysTenantMenuItem[];
}
