// Auto-generated types for SysUpazila
// Source: src\database\models\system\sys_upazila.model.ts

import type { SysDistrict } from '../models/system/sys_districts.model';
import type { SysUnion } from '../models/system/sys_union.model';
import type { SysUser } from '../models/system/sys_user.model';

export interface SysUpazilaAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  districtId: number;
  name: string;
  bnName: string;
  url?: string | null;
  createdBy?: number | null;
  updatedBy?: number | null;
  deletedBy?: number | null;

  // Relations
  district?: SysDistrict;
  unions?: SysUnion[];
  createdByUser?: SysUser;
  updatedByUser?: SysUser;
  deletedByUser?: SysUser;
}

export interface SysUpazilaCreationAttributes {
  districtId: number;
  name: string;
  bnName: string;
  url?: string | null;
  createdBy?: number | null;
  updatedBy?: number | null;
  deletedBy?: number | null;
}

export type SysUpazilaUpdateAttributes = Partial<SysUpazilaCreationAttributes>;

// Helper type for including relations
export interface SysUpazilaWithRelations extends SysUpazilaAttributes {
  district?: SysDistrict;
  unions?: SysUnion[];
  createdByUser?: SysUser;
  updatedByUser?: SysUser;
  deletedByUser?: SysUser;
}
