// Auto-generated types for SysPlan
// Source: src/database/models/system/sys_plan.model.ts

import { PlanBillingCycle } from '../models/system/sys_plan.model';
import { PlanStatus } from '../models/system/sys_plan.model';

import type { SysOrganization } from '../models/system/sys_organization.model';

export interface SysPlanAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  name: string;
  code: string;
  description?: string | null;
  monthlyPrice: number;
  yearlyPrice: number;
  currency: string;
  billingCycle: PlanBillingCycle;
  durationDays: number;
  trialDays: number;
  maxUsers: number;
  maxProjects: number;
  maxStorageMb: number;
  features?: any | null;
  status: PlanStatus;
  subscribersCount: number;

  // Relations
  organizations?: SysOrganization[];
}

export interface SysPlanCreationAttributes {
  name: string;
  code: string;
  description?: string | null;
  monthlyPrice?: number; // Has default value
  yearlyPrice?: number; // Has default value
  currency?: string; // Has default value
  billingCycle?: PlanBillingCycle; // Has default value
  durationDays?: number; // Has default value
  trialDays?: number; // Has default value
  maxUsers?: number; // Has default value
  maxProjects?: number; // Has default value
  maxStorageMb?: number; // Has default value
  features?: any | null;
  status?: PlanStatus; // Has default value
  subscribersCount?: number; // Has default value
}

export type SysPlanUpdateAttributes = Partial<SysPlanCreationAttributes>;

// Helper type for including relations
export interface SysPlanWithRelations extends SysPlanAttributes {
  organizations?: SysOrganization[];
}
