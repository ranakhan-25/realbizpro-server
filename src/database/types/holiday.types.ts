// Auto-generated types for Holiday
// Source: src/database/models/hrm/configuration/holiday_model.ts

import { HolidayStatus } from '../models/hrm/configuration/holiday_model';

import type { SysOrganization } from '../models/system/sys_organization.model';

export interface HolidayAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  reason: string;
  fromDate: string;
  toDate: string;
  description: string;
  status: HolidayStatus;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;

  // Relations
  organization?: SysOrganization;
}

export interface HolidayCreationAttributes {
  reason: string;
  fromDate: string;
  toDate: string;
  description: string;
  status?: HolidayStatus; // Has default value
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  orgId?: number | null;
}

export type HolidayUpdateAttributes = Partial<HolidayCreationAttributes>;

// Helper type for including relations
export interface HolidayWithRelations extends HolidayAttributes {
  organization?: SysOrganization;
}
