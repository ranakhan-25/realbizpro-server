// Auto-generated types for SysDivision
// Source: src\database\models\system\sys_divisions.model.ts

import type { SysDistrict } from '../models/system/sys_districts.model';
import type { SysUser } from '../models/system/sys_user.model';

export interface SysDivisionAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  name: string;
  bnName: string;
  url: string;
  createdBy?: number | null;
  updatedBy?: number | null;
  deletedBy?: number | null;

  // Relations
  districts?: SysDistrict[];
  createdByUser?: SysUser;
  updatedByUser?: SysUser;
  deletedByUser?: SysUser;
}

export interface SysDivisionCreationAttributes {
  name: string;
  bnName: string;
  url: string;
  createdBy?: number | null;
  updatedBy?: number | null;
  deletedBy?: number | null;
}

export type SysDivisionUpdateAttributes = Partial<SysDivisionCreationAttributes>;

// Helper type for including relations
export interface SysDivisionWithRelations extends SysDivisionAttributes {
  districts?: SysDistrict[];
  createdByUser?: SysUser;
  updatedByUser?: SysUser;
  deletedByUser?: SysUser;
}
