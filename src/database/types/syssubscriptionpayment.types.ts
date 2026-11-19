// Auto-generated types for SysSubscriptionPayment
// Source: src/database/models/system/sys_subscription_payment.model.ts

import { SubscriptionPaymentStatus } from '../models/system/sys_subscription_payment.model';

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { SysPlan } from '../models/system/sys_plan.model';
import type { SysUser } from '../models/system/sys_user.model';

export interface SysSubscriptionPaymentAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  organizationId: number;
  planId: number;
  userId: number;
  tranId: string;
  valId?: string | null;
  amount: number;
  currency: string;
  billingCycle: string;
  durationDays: number;
  status: SubscriptionPaymentStatus;
  bankTranId?: string | null;
  cardType?: string | null;
  cardBrand?: string | null;
  gatewayResponse?: any | null;
  paymentInitiatedAt: Date;
  paymentCompletedAt?: Date | null;

  // Relations
  organization?: SysOrganization;
  plan?: SysPlan;
  user?: SysUser;
}

export interface SysSubscriptionPaymentCreationAttributes {
  organizationId: number;
  planId: number;
  userId: number;
  tranId: string;
  valId?: string | null;
  amount: number;
  currency?: string; // Has default value
  billingCycle?: string; // Has default value
  durationDays?: number; // Has default value
  status?: SubscriptionPaymentStatus; // Has default value
  bankTranId?: string | null;
  cardType?: string | null;
  cardBrand?: string | null;
  gatewayResponse?: any | null;
  paymentInitiatedAt?: Date; // Has default value
  paymentCompletedAt?: Date | null;
}

export type SysSubscriptionPaymentUpdateAttributes = Partial<SysSubscriptionPaymentCreationAttributes>;

// Helper type for including relations
export interface SysSubscriptionPaymentWithRelations extends SysSubscriptionPaymentAttributes {
  organization?: SysOrganization;
  plan?: SysPlan;
  user?: SysUser;
}
