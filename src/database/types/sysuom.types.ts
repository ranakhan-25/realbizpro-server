// Auto-generated types for SysUom
// Source: src/database/models/system/sys_uom.model.ts

import { StatusEnum } from '../enum/status.enum';

import type { SysUser } from '../models/system/sys_user.model';

export interface SysUomAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  name: string;
  shortName: string | null;
  details: string | null;
  status: StatusEnum;
  createdBy: number;
  deletedBy: number | null;
  updatedBy?: number | null;

  // Relations
  createdByUser?: SysUser;
  deletedByUser?: SysUser;
  updatedByUser?: SysUser;
}

export interface SysUomCreationAttributes {
  name: string;
  shortName?: string | null; // Nullable
  details?: string | null; // Nullable
  status?: StatusEnum; // Has default value
  createdBy: number;
  deletedBy?: number | null; // Nullable
  updatedBy?: number | null;
}

export type SysUomUpdateAttributes = Partial<SysUomCreationAttributes>;

// Helper type for including relations
export interface SysUomWithRelations extends SysUomAttributes {
  createdByUser?: SysUser;
  deletedByUser?: SysUser;
  updatedByUser?: SysUser;
}
