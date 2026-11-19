// Auto-generated types for SysTenantSite
// Source: src/database/models/cms/sys_tenant_site.model.ts

import type { SysOrganization } from '../models/system/sys_organization.model';

export interface SysTenantSiteAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  orgId: number;
  subdomain: string;
  customDomain?: string | null;
  siteTitle: string;
  tagline?: string | null;
  logoUrl?: string | null;
  faviconUrl?: string | null;
  themeConfig: Record<string, any>;
  seoConfig: Record<string, any>;
  isPublished: boolean;

  // Relations
  organization?: SysOrganization;
}

export interface SysTenantSiteCreationAttributes {
  orgId: number;
  subdomain: string;
  customDomain?: string | null;
  siteTitle?: string; // Has default value
  tagline?: string | null;
  logoUrl?: string | null;
  faviconUrl?: string | null;
  themeConfig?: Record<string, any>; // Has default value
  seoConfig?: Record<string, any>; // Has default value
  isPublished?: boolean; // Has default value
}

export type SysTenantSiteUpdateAttributes = Partial<SysTenantSiteCreationAttributes>;

// Helper type for including relations
export interface SysTenantSiteWithRelations extends SysTenantSiteAttributes {
  organization?: SysOrganization;
}
