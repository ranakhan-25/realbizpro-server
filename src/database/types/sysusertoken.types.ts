// Auto-generated types for SysUserToken
// Source: src/database/models/system/sys_user_token.model.ts

import type { SysUser } from '../models/system/sys_user.model';

export interface SysUserTokenAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  userId: number;
  token: string;
  jti: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  expiresAt: Date;

  // Relations
  user?: SysUser;
}

export interface SysUserTokenCreationAttributes {
  userId: number;
  token: string;
  jti: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  expiresAt: Date;
}

export type SysUserTokenUpdateAttributes = Partial<SysUserTokenCreationAttributes>;

// Helper type for including relations
export interface SysUserTokenWithRelations extends SysUserTokenAttributes {
  user?: SysUser;
}
