// Auto-generated types for SysUnion
// Source: src\database\models\system\sys_union.model.ts

import type { SysUpazila } from '../models/system/sys_upazila.model';
import type { SysUser } from '../models/system/sys_user.model';

export interface SysUnionAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  upazilaId: number;
  name: string;
  bnName: string;
  url: string;
  createdBy: number;
  updatedBy?: number | null;
  deletedBy?: number | null;

  // Relations
  upazila?: SysUpazila;
  createdByUser?: SysUser;
  updatedByUser?: SysUser;
  deletedByUser?: SysUser;
}

export interface SysUnionCreationAttributes {
  upazilaId: number;
  name: string;
  bnName: string;
  url: string;
  createdBy: number;
  updatedBy?: number | null;
  deletedBy?: number | null;
}

export type SysUnionUpdateAttributes = Partial<SysUnionCreationAttributes>;

// Helper type for including relations
export interface SysUnionWithRelations extends SysUnionAttributes {
  upazila?: SysUpazila;
  createdByUser?: SysUser;
  updatedByUser?: SysUser;
  deletedByUser?: SysUser;
}
