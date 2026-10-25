import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { SysOrganization } from '../system/sys_organization.model';
import { SysTenantPage } from './sys_tenant_page.model';

import type { SysTenantPageBlockAttributes, SysTenantPageBlockCreationAttributes } from '../../types/systenantpageblock.types';

export enum BlockType {
  HERO = 'HERO',
  FEATURES = 'FEATURES',
  STATS = 'STATS',
  SERVICES = 'SERVICES',
  PRICING = 'PRICING',
  TESTIMONIALS = 'TESTIMONIALS',
  LEAD_FORM = 'LEAD_FORM',
  CUSTOM_HTML = 'CUSTOM_HTML',
}

@Table({
  tableName: 'sys_tenant_page_blocks',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class SysTenantPageBlock extends BaseModel<SysTenantPageBlockAttributes, SysTenantPageBlockCreationAttributes> {
  @ForeignKey(() => SysTenantPage)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare pageId: number;

  @ForeignKey(() => SysOrganization)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare orgId: number;

  @Column({
    type: DataType.ENUM(...Object.values(BlockType)),
    allowNull: false,
    defaultValue: BlockType.HERO,
  })
  declare blockType: BlockType;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 'Section Block',
  })
  declare blockName: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  declare orderIndex: number;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    defaultValue: {},
  })
  declare contentJson: Record<string, any>;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  declare isVisible: boolean;

  @BelongsTo(() => SysTenantPage, 'pageId')
  declare page?: SysTenantPage;

  @BelongsTo(() => SysOrganization, 'orgId')
  declare organization?: SysOrganization;
}
