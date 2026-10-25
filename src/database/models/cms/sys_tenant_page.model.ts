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
import { SysTenantPageBlock } from './sys_tenant_page_block.model';

import type { SysTenantPageAttributes, SysTenantPageCreationAttributes } from '../../types/systenantpage.types';

export enum PageStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

@Table({
  tableName: 'sys_tenant_pages',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class SysTenantPage extends BaseModel<SysTenantPageAttributes, SysTenantPageCreationAttributes> {
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
  declare title: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare slug: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare metaTitle?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare metaDescription?: string;

  @Column({
    type: DataType.ENUM(...Object.values(PageStatus)),
    allowNull: false,
    defaultValue: PageStatus.PUBLISHED,
  })
  declare status: PageStatus;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare isHomePage: boolean;

  @BelongsTo(() => SysOrganization, 'orgId')
  declare organization?: SysOrganization;

  @HasMany(() => SysTenantPageBlock, 'pageId')
  declare blocks?: SysTenantPageBlock[];
}
