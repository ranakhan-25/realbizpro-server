// Auto-generated types for SysModules
// Source: src\database\models\system\sys_module.model.ts

import type { SysMenu } from '../models/system/sys_menu.model';
import type { SysFeatures } from '../models/system/sys_features.model';
import type { SysUser } from '../models/system/sys_user.model';

export interface SysModulesAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  name: string;
  code?: string | null;
  pathRoute?: string | null;
  icon?: string | null;
  displayOrder: number;
  isActive: boolean;
  description?: string | null;

  // Relations
  menus?: SysMenu[];
  features?: SysFeatures[];
  users?: SysUser[];
}

export interface SysModulesCreationAttributes {
  name: string;
  code?: string | null;
  pathRoute?: string | null;
  icon?: string | null;
  displayOrder?: number; // Has default value
  isActive?: boolean; // Has default value
  description?: string | null;
}

export type SysModulesUpdateAttributes = Partial<SysModulesCreationAttributes>;

// Helper type for including relations
export interface SysModulesWithRelations extends SysModulesAttributes {
  menus?: SysMenu[];
  features?: SysFeatures[];
  users?: SysUser[];
}
