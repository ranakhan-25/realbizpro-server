// Auto-generated types for SysTenantPageBlock
// Source: src/database/models/cms/sys_tenant_page_block.model.ts

import { BlockType } from '../models/cms/sys_tenant_page_block.model';

import type { SysTenantPage } from '../models/cms/sys_tenant_page.model';
import type { SysOrganization } from '../models/system/sys_organization.model';

export interface SysTenantPageBlockAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  pageId: number;
  orgId: number;
  blockType: BlockType;
  blockName: string;
  orderIndex: number;
  contentJson: Record<string, any>;
  isVisible: boolean;

  // Relations
  page?: SysTenantPage;
  organization?: SysOrganization;
}

export interface SysTenantPageBlockCreationAttributes {
  pageId: number;
  orgId: number;
  blockType?: BlockType; // Has default value
  blockName?: string; // Has default value
  orderIndex?: number; // Has default value
  contentJson?: Record<string, any>; // Has default value
  isVisible?: boolean; // Has default value
}

export type SysTenantPageBlockUpdateAttributes = Partial<SysTenantPageBlockCreationAttributes>;

// Helper type for including relations
export interface SysTenantPageBlockWithRelations extends SysTenantPageBlockAttributes {
  page?: SysTenantPage;
  organization?: SysOrganization;
}
