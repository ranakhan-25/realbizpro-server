// Auto-generated types for SysRole
// Source: src\database\models\system\sys_role.model.ts

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { SysRoleFeature } from '../models/system/sys_role_feature.model';
import type { SysUser } from '../models/system/sys_user.model';
import type { SysPermission } from '../models/system/sys_permission.model';

export interface SysRoleAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  name: string;
  slug: string;
  description?: string | null;
  orgId?: number | null;
  orgUuid?: string | null;
  isSystemRole: boolean;

  // Relations
  organization?: SysOrganization;
  roleFeatures?: SysRoleFeature[];
  users?: SysUser[];
  permissions?: SysPermission[];
}

export interface SysRoleCreationAttributes {
  name: string;
  slug: string;
  description?: string | null;
  orgId?: number | null;
  orgUuid?: string | null;
  isSystemRole?: boolean; // Has default value
}

export type SysRoleUpdateAttributes = Partial<SysRoleCreationAttributes>;

// Helper type for including relations
export interface SysRoleWithRelations extends SysRoleAttributes {
  organization?: SysOrganization;
  roleFeatures?: SysRoleFeature[];
  users?: SysUser[];
  permissions?: SysPermission[];
}
