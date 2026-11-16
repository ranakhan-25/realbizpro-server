// Auto-generated types for SysRolePermission
// Source: src\database\models\system\sys_role_permission.model.ts

import type { SysRole } from '../models/system/sys_role.model';
import type { SysPermission } from '../models/system/sys_permission.model';

export interface SysRolePermissionAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  roleId: number;
  permissionId: number;

  // Relations
  role: SysRole;
  permission: SysPermission;
}

export interface SysRolePermissionCreationAttributes {
  roleId: number;
  permissionId: number;
}

export type SysRolePermissionUpdateAttributes = Partial<SysRolePermissionCreationAttributes>;

// Helper type for including relations
export interface SysRolePermissionWithRelations extends SysRolePermissionAttributes {
  role: SysRole;
  permission: SysPermission;
}
