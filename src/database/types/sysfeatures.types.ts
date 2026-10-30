// Auto-generated types for SysFeatures
// Source: src/database/models/system/sys_features.model.ts

import type { SysModules } from '../models/system/sys_module.model';
import type { SysPermission } from '../models/system/sys_permission.model';
import type { SysOrgEntitlement } from '../models/system/sys_org_entitlement.model';
import type { SysRoleFeature } from '../models/system/sys_role_feature.model';
import type { SysUserFeatureOverride } from '../models/system/sys_user_feature_override.model';

export interface SysFeaturesAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  name: string;
  code?: string | null;
  routePath?: string | null;
  actions: string[];
  displayOrder: number;
  isActive: boolean;
  description?: string | null;
  moduleId?: number | null;

  // Relations
  module?: SysModules;
  permissions?: SysPermission[];
  orgEntitlements?: SysOrgEntitlement[];
  roleFeatures?: SysRoleFeature[];
  userOverrides?: SysUserFeatureOverride[];
}

export interface SysFeaturesCreationAttributes {
  name: string;
  code?: string | null;
  routePath?: string | null;
  actions?: string[]; // Has default value
  displayOrder?: number; // Has default value
  isActive?: boolean; // Has default value
  description?: string | null;
  moduleId?: number | null;
}

export type SysFeaturesUpdateAttributes = Partial<SysFeaturesCreationAttributes>;

// Helper type for including relations
export interface SysFeaturesWithRelations extends SysFeaturesAttributes {
  module?: SysModules;
  permissions?: SysPermission[];
  orgEntitlements?: SysOrgEntitlement[];
  roleFeatures?: SysRoleFeature[];
  userOverrides?: SysUserFeatureOverride[];
}
