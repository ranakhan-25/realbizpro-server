// Auto-generated types for SysMenuPermission
// Source: src\database\models\system\sys_menu_permission.model.ts

import type { SysMenu } from '../models/system/sys_menu.model';
import type { SysPermission } from '../models/system/sys_permission.model';

export interface SysMenuPermissionAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  menuId: number;
  permissionId: number;

  // Relations
  menu?: SysMenu;
  permission?: SysPermission;
}

export interface SysMenuPermissionCreationAttributes {
  menuId: number;
  permissionId: number;
}

export type SysMenuPermissionUpdateAttributes = Partial<SysMenuPermissionCreationAttributes>;

// Helper type for including relations
export interface SysMenuPermissionWithRelations extends SysMenuPermissionAttributes {
  menu?: SysMenu;
  permission?: SysPermission;
}
