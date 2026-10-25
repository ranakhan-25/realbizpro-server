import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { SysOrganization } from '../system/sys_organization.model';

import type { SysTenantSiteAttributes, SysTenantSiteCreationAttributes } from '../../types/systenantsite.types';

@Table({
  tableName: 'sys_tenant_sites',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class SysTenantSite extends BaseModel<SysTenantSiteAttributes, SysTenantSiteCreationAttributes> {
  @ForeignKey(() => SysOrganization)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    unique: true,
  })
  declare orgId: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare subdomain: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
  })
  declare customDomain?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 'My Organization Portal',
  })
  declare siteTitle: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare tagline?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare logoUrl?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare faviconUrl?: string;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    defaultValue: {
      primaryColor: '#0000F2',
      secondaryColor: '#3B82F6',
      accentColor: '#00D2FF',
      fontFamily: 'Inter',
      darkMode: false,
      borderRadius: '8px',
    },
  })
  declare themeConfig: Record<string, any>;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    defaultValue: {
      metaTitle: 'RealBiz Pro Multi-Tenant Enterprise Portal',
      metaDescription: 'Enterprise portal and client services management powered by RealBiz Pro.',
      ogImage: '',
      keywords: 'saas, enterprise, business, portal',
    },
  })
  declare seoConfig: Record<string, any>;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  declare isPublished: boolean;

  @BelongsTo(() => SysOrganization, 'orgId')
  declare organization?: SysOrganization;
}
