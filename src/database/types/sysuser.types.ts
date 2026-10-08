// Auto-generated types for SysUser
// Source: src\database\models\system\sys_user.model.ts

import type { SysFileModel } from '../models/system/sys_file.model';
import type { SysRole } from '../models/system/sys_role.model';
import type { SysModules } from '../models/system/sys_module.model';
import type { SysPermission } from '../models/system/sys_permission.model';
import type { SysUserToken } from '../models/system/sys_user_token.model';
import type { SysUserPermission } from '../models/system/sys_user_permission.model';
import type { SysCompany } from '../models/system/sys_company.model';
import type { SysUserCompany } from '../models/system/sys_user_company.model';

export interface SysUserAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  name: string;
  email: string;
  mobile?: string | null;
  password: string;
  userCode?: string | null;
  designationName?: string | null;
  fileId?: number | null;
  fcmToken?: string | null;
  receivingPointId?: number | null;
  employeeId?: number | null;
  distributionId?: number | null;
  warehouseId?: number | null;
  factoryId?: number | null;
  unitId?: number | null;
  userType: string;
  refreshTokenExpiresAt?: Date | null;
  designationId?: number | null;
  lastLoginAt?: Date | null;
  firstName?: string | null;
  lastName?: string | null;
  username?: string | null;
  phone?: string | null;
  isSuperUser?: boolean | null;
  isActive?: boolean | null;
  passwordHash?: string | null;
  refreshToken?: string | null;
  lastLogoutAt?: Date | null;

  // Relations
  avatar?: SysFileModel;
  roles?: SysRole[];
  modules?: SysModules[];
  permissions?: SysPermission[];
  tokens?: SysUserToken[];
  userPermissions?: SysUserPermission[];
  companies?: SysCompany[];
  userCompanies?: SysUserCompany[];
}

export interface SysUserCreationAttributes {
  name: string;
  email: string;
  mobile?: string | null;
  password: string;
  userCode?: string | null;
  designationName?: string | null;
  fileId?: number | null;
  fcmToken?: string | null;
  receivingPointId?: number | null;
  employeeId?: number | null;
  distributionId?: number | null;
  warehouseId?: number | null;
  factoryId?: number | null;
  unitId?: number | null;
  userType?: string; // Has default value
  refreshTokenExpiresAt?: Date | null;
  designationId?: number | null;
  lastLoginAt?: Date | null;
  firstName?: string | null;
  lastName?: string | null;
  username?: string | null;
  phone?: string | null;
  isSuperUser?: boolean | null;
  isActive?: boolean | null;
  passwordHash?: string | null;
  refreshToken?: string | null;
  lastLogoutAt?: Date | null;
}

export type SysUserUpdateAttributes = Partial<SysUserCreationAttributes>;

// Helper type for including relations
export interface SysUserWithRelations extends SysUserAttributes {
  avatar?: SysFileModel;
  roles?: SysRole[];
  modules?: SysModules[];
  permissions?: SysPermission[];
  tokens?: SysUserToken[];
  userPermissions?: SysUserPermission[];
  companies?: SysCompany[];
  userCompanies?: SysUserCompany[];
}
