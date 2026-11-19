// Auto-generated types for SysCustomPermission
// Source: src/database/models/system/sys_custom_permission.model.ts

import type { SysFeatures } from '../models/system/sys_features.model';

export interface SysCustomPermissionAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  key: string;
  name: string;
  description?: string | null;
  resource?: string | null;
  action: string;
  context: string;
  featureId?: number | null;

  // Relations
  feature?: SysFeatures;
}

export interface SysCustomPermissionCreationAttributes {
  key: string;
  name: string;
  description?: string | null;
  resource?: string | null;
  action: string;
  context?: string; // Has default value
  featureId?: number | null;
}

export type SysCustomPermissionUpdateAttributes = Partial<SysCustomPermissionCreationAttributes>;

// Helper type for including relations
export interface SysCustomPermissionWithRelations extends SysCustomPermissionAttributes {
  feature?: SysFeatures;
}
