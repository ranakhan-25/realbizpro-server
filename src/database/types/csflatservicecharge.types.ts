// Auto-generated types for CsFlatServiceCharge
// Source: src/database/models/customer-service/cs_flat_service_charge.model.ts

import { ServiceChargePaymentStatus } from '../models/customer-service/cs_service_charge.types';

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';

export interface CsFlatServiceChargeAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  organizationId: number;
  createdBy?: number | null;
  updatedBy?: number | null;
  deletedBy?: number | null;
  projectId: string;
  flatNumber: string;
  residentName: string;
  residentPhone?: string | null;
  flatSizeSqft: number;
  billingMonth: string;
  rateApplied: number;
  totalAmount: number;
  paidAmount: number;
  paymentStatus: ServiceChargePaymentStatus;
  dueDate: string;
  paymentDate?: string | null;
  paymentMethod?: string | null;
  referenceNumber?: string | null;
  notes?: string | null;

  // Relations
  organization?: SysOrganization;
  project?: Project;
}

export interface CsFlatServiceChargeCreationAttributes {
  organizationId: number;
  createdBy?: number | null;
  updatedBy?: number | null;
  deletedBy?: number | null;
  projectId: string;
  flatNumber: string;
  residentName: string;
  residentPhone?: string | null;
  flatSizeSqft?: number; // Has default value
  billingMonth: string;
  rateApplied?: number; // Has default value
  totalAmount?: number; // Has default value
  paidAmount?: number; // Has default value
  paymentStatus?: ServiceChargePaymentStatus; // Has default value
  dueDate: string;
  paymentDate?: string | null;
  paymentMethod?: string | null;
  referenceNumber?: string | null;
  notes?: string | null;
}

export type CsFlatServiceChargeUpdateAttributes = Partial<CsFlatServiceChargeCreationAttributes>;

// Helper type for including relations
export interface CsFlatServiceChargeWithRelations extends CsFlatServiceChargeAttributes {
  organization?: SysOrganization;
  project?: Project;
}
