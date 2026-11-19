// Auto-generated types for SysUserCustomPermission
// Source: src/database/models/system/sys_user_custom_permission.model.ts

import type { SysUser } from '../models/system/sys_user.model';
import type { SysCustomPermission } from '../models/system/sys_custom_permission.model';

export interface SysUserCustomPermissionAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  userId: number;
  customPermissionId: number;
  effect: string;
  reason?: string | null;

  // Relations
  user?: SysUser;
  customPermission?: SysCustomPermission;
}

export interface SysUserCustomPermissionCreationAttributes {
  userId: number;
  customPermissionId: number;
  effect?: string; // Has default value
  reason?: string | null;
}

export type SysUserCustomPermissionUpdateAttributes = Partial<SysUserCustomPermissionCreationAttributes>;

// Helper type for including relations
export interface SysUserCustomPermissionWithRelations extends SysUserCustomPermissionAttributes {
  user?: SysUser;
  customPermission?: SysCustomPermission;
}
