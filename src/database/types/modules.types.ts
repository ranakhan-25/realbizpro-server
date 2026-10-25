// Auto-generated types for Modules
// Source: src\database\models\module.model.ts

import type { SysMenu } from '../models/system/sys_menu.model';
import type { SysUser } from '../models/system/sys_user.model';

export interface ModulesAttributes {
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

export interface ModulesCreationAttributes {
  name: string;
  description?: string | null;
}

export type ModulesUpdateAttributes = Partial<ModulesCreationAttributes>;

// Helper type for including relations
export interface ModulesWithRelations extends ModulesAttributes {
  menus?: SysMenu[];
  users?: SysUser[];
}
