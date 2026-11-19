// Auto-generated types for SysTenantMenuItem
// Source: src/database/models/cms/sys_tenant_menu_item.model.ts

import type { SysTenantMenu } from '../models/cms/sys_tenant_menu.model';
import type { SysOrganization } from '../models/system/sys_organization.model';
import type { SysTenantMenuItem } from '../models/cms/sys_tenant_menu_item.model';

export interface SysTenantMenuItemAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  menuId: number;
  orgId: number;
  parentId?: number | null;
  title: string;
  url: string;
  target: string;
  icon?: string | null;
  orderIndex: number;
  isVisible: boolean;

  // Relations
  menu?: SysTenantMenu;
  organization?: SysOrganization;
  parent?: SysTenantMenuItem;
  children?: SysTenantMenuItem[];
}

export interface SysTenantMenuItemCreationAttributes {
  menuId: number;
  orgId: number;
  parentId?: number | null;
  title: string;
  url?: string; // Has default value
  target?: string; // Has default value
  icon?: string | null;
  orderIndex?: number; // Has default value
  isVisible?: boolean; // Has default value
}

export type SysTenantMenuItemUpdateAttributes = Partial<SysTenantMenuItemCreationAttributes>;

// Helper type for including relations
export interface SysTenantMenuItemWithRelations extends SysTenantMenuItemAttributes {
  menu?: SysTenantMenu;
  organization?: SysOrganization;
  parent?: SysTenantMenuItem;
  children?: SysTenantMenuItem[];
}
