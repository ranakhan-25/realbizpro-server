// Auto-generated types for SysUserFeatureOverride
// Source: src/database/models/system/sys_user_feature_override.model.ts

import type { SysUser } from '../models/system/sys_user.model';
import type { SysFeatures } from '../models/system/sys_features.model';

export interface SysUserFeatureOverrideAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  userId: number;
  featureId: number;
  isGranted: boolean;
  canView?: boolean | null;
  canCreate?: boolean | null;
  canEdit?: boolean | null;
  canDelete?: boolean | null;
  canApprove?: boolean | null;

  // Relations
  user?: SysUser;
  feature?: SysFeatures;
}

export interface SysUserFeatureOverrideCreationAttributes {
  userId: number;
  featureId: number;
  isGranted?: boolean; // Has default value
  canView?: boolean | null;
  canCreate?: boolean | null;
  canEdit?: boolean | null;
  canDelete?: boolean | null;
  canApprove?: boolean | null;
}

export type SysUserFeatureOverrideUpdateAttributes = Partial<SysUserFeatureOverrideCreationAttributes>;

// Helper type for including relations
export interface SysUserFeatureOverrideWithRelations extends SysUserFeatureOverrideAttributes {
  user?: SysUser;
  feature?: SysFeatures;
}
