// Auto-generated types for SysDistrict
// Source: src/database/models/system/sys_districts.model.ts

import type { SysDivision } from '../models/system/sys_divisions.model';
import type { SysUpazila } from '../models/system/sys_upazila.model';
import type { SysUser } from '../models/system/sys_user.model';

export interface SysDistrictAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  divisionId: number;
  name: string;
  bnName: string;
  lat?: string | null;
  lon?: string | null;
  url: string;
  createdBy?: number | null;
  updatedBy?: number | null;
  deletedBy?: number | null;

  // Relations
  division?: SysDivision;
  upazilas?: SysUpazila[];
  createdByUser?: SysUser;
  updatedByUser?: SysUser;
  deletedByUser?: SysUser;
}

export interface SysDistrictCreationAttributes {
  divisionId: number;
  name: string;
  bnName: string;
  lat?: string | null;
  lon?: string | null;
  url: string;
  createdBy?: number | null;
  updatedBy?: number | null;
  deletedBy?: number | null;
}

export type SysDistrictUpdateAttributes = Partial<SysDistrictCreationAttributes>;

// Helper type for including relations
export interface SysDistrictWithRelations extends SysDistrictAttributes {
  division?: SysDivision;
  upazilas?: SysUpazila[];
  createdByUser?: SysUser;
  updatedByUser?: SysUser;
  deletedByUser?: SysUser;
}
