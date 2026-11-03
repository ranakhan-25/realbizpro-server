// Auto-generated types for SysUserSection
// Source: src/database/models/system/sys_user_section.model.ts

import type { SysUser } from '../models/system/sys_user.model';

export interface SysUserSectionAttributes {
  userId: number;
  sectionId: number;

  // Relations
  user: SysUser;
}

export interface SysUserSectionCreationAttributes {
  userId: number;
  sectionId: number;
}

export type SysUserSectionUpdateAttributes = Partial<SysUserSectionCreationAttributes>;

// Helper type for including relations
export interface SysUserSectionWithRelations extends SysUserSectionAttributes {
  user: SysUser;
}
