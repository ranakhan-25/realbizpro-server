// Auto-generated types for ZkTecoDevice
// Source: src/database/models/hrm/configuration/zkteco_device_model.ts

import { ZkTecoDeviceType } from '../models/hrm/configuration/zkteco_device_model';
import { ZkTecoDeviceStatus } from '../models/hrm/configuration/zkteco_device_model';

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface ZkTecoDeviceAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  type: ZkTecoDeviceType;
  name: string;
  sn: string;
  ip?: string | null;
  port?: string | null;
  lastOnline?: Date | null;
  status: ZkTecoDeviceStatus;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;

  // Relations
  organization?: SysOrganization;
  project?: Project;
}

export interface ZkTecoDeviceCreationAttributes {
  type: ZkTecoDeviceType;
  name: string;
  sn: string;
  ip?: string | null;
  port?: string | null;
  lastOnline?: Date | null;
  status?: ZkTecoDeviceStatus; // Has default value
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
  projectId?: string | null;
}

export type ZkTecoDeviceUpdateAttributes = Partial<ZkTecoDeviceCreationAttributes>;

// Helper type for including relations
export interface ZkTecoDeviceWithRelations extends ZkTecoDeviceAttributes {
  organization?: SysOrganization;
  project?: Project;
}
