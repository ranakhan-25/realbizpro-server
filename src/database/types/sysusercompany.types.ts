// Auto-generated types for SysUserCompany
// Source: src/database/models/system/sys_user_company.model.ts

import type { SysUser } from '../models/system/sys_user.model';
import type { SysCompany } from '../models/system/sys_company.model';

export interface SysUserCompanyAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  userId: number;
  companyId: number;
  createdBy?: number | null;
  updatedBy?: number | null;

  // Relations
  user: SysUser;
  company: SysCompany;
}

export interface SysUserCompanyCreationAttributes {
  userId: number;
  companyId: number;
  createdBy?: number | null;
  updatedBy?: number | null;
}

export type SysUserCompanyUpdateAttributes = Partial<SysUserCompanyCreationAttributes>;

// Helper type for including relations
export interface SysUserCompanyWithRelations extends SysUserCompanyAttributes {
  user: SysUser;
  company: SysCompany;
}
