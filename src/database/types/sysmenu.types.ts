// Auto-generated types for SysMenu
// Source: src\database\models\system\sys_menu.model.ts

import type { SysMenu } from '../models/system/sys_menu.model';
import type { SysModules } from '../models/system/sys_module.model';
import type { SysPermission } from '../models/system/sys_permission.model';
import type { SysMenuPermission } from '../models/system/sys_menu_permission.model';

export interface SysMenuAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  title: string;
  url: string | null;
  target: string | null;
  location: (
    | 'HEADER'
    | 'FOOTER'
    | 'SIDEBAR'
    | 'NOTFOUND'
  )[];
  icon?: string | null;
  elementClass?: string | null;
  elementId?: string | null;
  order: number;
  description?: string | null;
  parentId?: number | null;
  isVisible: boolean;
  moduleId?: number | null;

  // Relations
  parent?: SysMenu;
  children?: SysMenu[];
  module?: SysModules;
  permissions?: SysPermission[];
  menuPermissions?: SysMenuPermission[];
}

export interface SysMenuCreationAttributes {
  title: string;
  url?: string | null; // Nullable
  target?: string | null; // Has default value
  location?: (
    | 'HEADER'
    | 'FOOTER'
    | 'SIDEBAR'
    | 'NOTFOUND'
  )[]; // Has default value
  icon?: string | null;
  elementClass?: string | null;
  elementId?: string | null;
  order?: number; // Has default value
  description?: string | null;
  parentId?: number | null;
  isVisible?: boolean; // Has default value
  moduleId?: number | null;
}

export type SysMenuUpdateAttributes = Partial<SysMenuCreationAttributes>;

// Helper type for including relations
export interface SysMenuWithRelations extends SysMenuAttributes {
  parent?: SysMenu;
  children?: SysMenu[];
  module?: SysModules;
  permissions?: SysPermission[];
  menuPermissions?: SysMenuPermission[];
}
