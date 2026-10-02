// Auto-generated types for SysRole
// Source: src\database\models\system\sys_role.model.ts

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

  // Relations
  users?: SysUser[];
  permissions?: SysPermission[];
}

export interface SysRoleCreationAttributes {
  name: string;
  slug: string;
  description?: string | null;
}

export type SysRoleUpdateAttributes = Partial<SysRoleCreationAttributes>;

// Helper type for including relations
export interface SysRoleWithRelations extends SysRoleAttributes {
  users?: SysUser[];
  permissions?: SysPermission[];
}
