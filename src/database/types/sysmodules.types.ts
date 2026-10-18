// Auto-generated types for SysModules
// Source: src\database\models\system\sys_module.model.ts

import type { SysMenu } from '../models/system/sys_menu.model';
import type { SysUser } from '../models/system/sys_user.model';

export interface SysModulesAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  name: string;
  description?: string | null;

  // Relations
  menus?: SysMenu[];
  users?: SysUser[];
}

export interface SysModulesCreationAttributes {
  name: string;
  description?: string | null;
}

export type SysModulesUpdateAttributes = Partial<SysModulesCreationAttributes>;

// Helper type for including relations
export interface SysModulesWithRelations extends SysModulesAttributes {
  menus?: SysMenu[];
  users?: SysUser[];
}
