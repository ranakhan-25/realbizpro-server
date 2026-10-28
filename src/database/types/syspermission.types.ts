// Auto-generated types for SysPermission
// Source: src\database\models\system\sys_permission.model.ts

import { ActionType } from '../models/system/sys_permission.model';
import { ContextTypes } from '../models/system/sys_permission.model';

import type { SysRole } from '../models/system/sys_role.model';
import type { SysFeatures } from '../models/system/sys_features.model';
import type { SysMenu } from '../models/system/sys_menu.model';
import type { SysMenuPermission } from '../models/system/sys_menu_permission.model';

export interface SysPermissionAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  key: string;
  name?: string | null;
  description?: string | null;
  resource: string;
  action: ActionType;
  context: ContextTypes;
  featureId?: number | null;

  // Relations
  roles?: SysRole[];
  feature?: SysFeatures;
  menus?: SysMenu[];
  menuPermissions?: SysMenuPermission[];
}

export interface SysPermissionCreationAttributes {
  key: string;
  name?: string | null;
  description?: string | null;
  resource: string;
  action: ActionType;
  context: ContextTypes;
  featureId?: number | null;
}

export type SysPermissionUpdateAttributes = Partial<SysPermissionCreationAttributes>;

// Helper type for including relations
export interface SysPermissionWithRelations extends SysPermissionAttributes {
  roles?: SysRole[];
  feature?: SysFeatures;
  menus?: SysMenu[];
  menuPermissions?: SysMenuPermission[];
}
