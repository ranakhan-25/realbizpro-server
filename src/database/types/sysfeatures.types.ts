// Auto-generated types for SysFeatures
// Source: src\database\models\system\sys_features.model.ts

import type { SysModules } from '../models/system/sys_module.model';
import type { SysPermission } from '../models/system/sys_permission.model';

export interface SysFeaturesAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  name: string;
  description?: string | null;
  moduleId?: number | null;

  // Relations
  module?: SysModules;
  permissions?: SysPermission[];
}

export interface SysFeaturesCreationAttributes {
  name: string;
  description?: string | null;
  moduleId?: number | null;
}

export type SysFeaturesUpdateAttributes = Partial<SysFeaturesCreationAttributes>;

// Helper type for including relations
export interface SysFeaturesWithRelations extends SysFeaturesAttributes {
  module?: SysModules;
  permissions?: SysPermission[];
}
