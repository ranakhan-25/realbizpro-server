// Auto-generated types for SysOrganization
// Source: src/database/models/system/sys_organization.model.ts

import { OrgSubscriptionStatus } from '../models/system/sys_organization.model';

import type { SysPlan } from '../models/system/sys_plan.model';
import type { SysUser } from '../models/system/sys_user.model';
import type { SysOrgEntitlement } from '../models/system/sys_org_entitlement.model';

export interface SysOrganizationAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  name: string;
  code: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  planId?: number | null;
  planUuid?: string | null;
  subscriptionStatus: OrgSubscriptionStatus;
  subscriptionStartDate?: Date | null;
  subscriptionEndDate?: Date | null;
  trialEndsAt?: Date | null;
  maxUsers: number;
  maxProjects: number;
  maxStorageMb: number;
  isLocked: boolean;
  lockReason?: string | null;
  metadata?: any | null;

  // Relations
  plan?: SysPlan;
  users?: SysUser[];
  entitlements?: SysOrgEntitlement[];
}

export interface SysOrganizationCreationAttributes {
  name: string;
  code: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  planId?: number | null;
  planUuid?: string | null;
  subscriptionStatus?: OrgSubscriptionStatus; // Has default value
  subscriptionStartDate?: Date | null;
  subscriptionEndDate?: Date | null;
  trialEndsAt?: Date | null;
  maxUsers?: number; // Has default value
  maxProjects?: number; // Has default value
  maxStorageMb?: number; // Has default value
  isLocked?: boolean; // Has default value
  lockReason?: string | null;
  metadata?: any | null;
}

export type SysOrganizationUpdateAttributes = Partial<SysOrganizationCreationAttributes>;

// Helper type for including relations
export interface SysOrganizationWithRelations extends SysOrganizationAttributes {
  plan?: SysPlan;
  users?: SysUser[];
  entitlements?: SysOrgEntitlement[];
}
