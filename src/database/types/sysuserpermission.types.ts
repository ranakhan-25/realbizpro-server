// Auto-generated types for SysUserPermission
// Source: src/database/models/system/sys_user_permission.model.ts

import type { SysUser } from '../models/system/sys_user.model';
import type { SysPermission } from '../models/system/sys_permission.model';

export interface SysUserPermissionAttributes {
  userId: number;
  permissionId: number;

  // Relations
  user?: SysUser;
  permission?: SysPermission;
}

export interface SysUserPermissionCreationAttributes {
  userId: number;
  permissionId: number;
}

export type SysUserPermissionUpdateAttributes = Partial<SysUserPermissionCreationAttributes>;

// Helper type for including relations
export interface SysUserPermissionWithRelations extends SysUserPermissionAttributes {
  user?: SysUser;
  permission?: SysPermission;
}
