// Auto-generated types for SysTenantPage
// Source: src/database/models/cms/sys_tenant_page.model.ts

import { PageStatus } from '../models/cms/sys_tenant_page.model';

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { SysTenantPageBlock } from '../models/cms/sys_tenant_page_block.model';

export interface SysTenantPageAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  orgId: number;
  title: string;
  slug: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  status: PageStatus;
  isHomePage: boolean;

  // Relations
  organization?: SysOrganization;
  blocks?: SysTenantPageBlock[];
}

export interface SysTenantPageCreationAttributes {
  orgId: number;
  title: string;
  slug: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  status?: PageStatus; // Has default value
  isHomePage?: boolean; // Has default value
}

export type SysTenantPageUpdateAttributes = Partial<SysTenantPageCreationAttributes>;

// Helper type for including relations
export interface SysTenantPageWithRelations extends SysTenantPageAttributes {
  organization?: SysOrganization;
  blocks?: SysTenantPageBlock[];
}
