// Auto-generated types for SysUserRole
// Source: src/database/models/system/sys_user_role.model.ts

import type { SysUser } from '../models/system/sys_user.model';
import type { SysRole } from '../models/system/sys_role.model';

export interface SysUserRoleAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  userId: number;
  roleId: number;

  // Relations
  user: SysUser;
  role: SysRole;
}

export interface SysUserRoleCreationAttributes {
  userId: number;
  roleId: number;
}

export type SysUserRoleUpdateAttributes = Partial<SysUserRoleCreationAttributes>;

// Helper type for including relations
export interface SysUserRoleWithRelations extends SysUserRoleAttributes {
  user: SysUser;
  role: SysRole;
}
