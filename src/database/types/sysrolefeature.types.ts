// Auto-generated types for SysRoleFeature
// Source: src/database/models/system/sys_role_feature.model.ts

import type { SysRole } from '../models/system/sys_role.model';
import type { SysFeatures } from '../models/system/sys_features.model';

export interface SysRoleFeatureAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  roleId: number;
  featureId: number;
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canApprove: boolean;

  // Relations
  role?: SysRole;
  feature?: SysFeatures;
}

export interface SysRoleFeatureCreationAttributes {
  roleId: number;
  featureId: number;
  canView?: boolean; // Has default value
  canCreate?: boolean; // Has default value
  canEdit?: boolean; // Has default value
  canDelete?: boolean; // Has default value
  canApprove?: boolean; // Has default value
}

export type SysRoleFeatureUpdateAttributes = Partial<SysRoleFeatureCreationAttributes>;

// Helper type for including relations
export interface SysRoleFeatureWithRelations extends SysRoleFeatureAttributes {
  role?: SysRole;
  feature?: SysFeatures;
}
