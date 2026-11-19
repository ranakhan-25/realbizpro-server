// Auto-generated types for SysTenantMenu
// Source: src/database/models/cms/sys_tenant_menu.model.ts

import { TenantMenuLocation } from '../models/cms/sys_tenant_menu.model';

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { SysTenantMenuItem } from '../models/cms/sys_tenant_menu_item.model';

export interface SysTenantMenuAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  orgId: number;
  name: string;
  location: TenantMenuLocation;
  isActive: boolean;

  // Relations
  organization?: SysOrganization;
  items?: SysTenantMenuItem[];
}

export interface SysTenantMenuCreationAttributes {
  orgId: number;
  name: string;
  location?: TenantMenuLocation; // Has default value
  isActive?: boolean; // Has default value
}

export type SysTenantMenuUpdateAttributes = Partial<SysTenantMenuCreationAttributes>;

// Helper type for including relations
export interface SysTenantMenuWithRelations extends SysTenantMenuAttributes {
  organization?: SysOrganization;
  items?: SysTenantMenuItem[];
}
