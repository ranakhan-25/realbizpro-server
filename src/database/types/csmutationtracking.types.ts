// Auto-generated types for CsMutationTracking
// Source: src/database/models/customer-service/cs_mutation_tracking.model.ts

import { MutationStage } from '../models/customer-service/cs_documents.types';

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';
import type { FlatLandBooking } from '../models/projects/flat-land-booking/pr_flat_land_booking.model';
import type { CsCustomerProfile } from '../models/customer-service/cs_customer_profile.model';

export interface CsMutationTrackingAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  organizationId: number;
  createdBy?: number | null;
  updatedBy?: number | null;
  deletedBy?: number | null;
  projectId?: string | null;
  bookingId?: string | null;
  customerProfileId?: number | null;
  mutCode: string;
  customerName: string;
  unitName?: string | null;
  projectName?: string | null;
  mutationAppNo: string;
  acLandOffice: string;
  currentStage: MutationStage;
  hearingDate?: string | null;
  dcrNumber?: string | null;
  dcrFeeAmount: number;
  dcrPaid: boolean;
  khatianNumber?: string | null;
  remarks?: string | null;

  // Relations
  organization?: SysOrganization;
  projectDetails?: Project;
  booking?: FlatLandBooking;
  customerProfile?: CsCustomerProfile;
}

export interface CsMutationTrackingCreationAttributes {
  organizationId: number;
  createdBy?: number | null;
  updatedBy?: number | null;
  deletedBy?: number | null;
  projectId?: string | null;
  bookingId?: string | null;
  customerProfileId?: number | null;
  mutCode: string;
  customerName: string;
  unitName?: string | null;
  projectName?: string | null;
  mutationAppNo: string;
  acLandOffice: string;
  currentStage?: MutationStage; // Has default value
  hearingDate?: string | null;
  dcrNumber?: string | null;
  dcrFeeAmount?: number; // Has default value
  dcrPaid?: boolean; // Has default value
  khatianNumber?: string | null;
  remarks?: string | null;
}

export type CsMutationTrackingUpdateAttributes = Partial<CsMutationTrackingCreationAttributes>;

// Helper type for including relations
export interface CsMutationTrackingWithRelations extends CsMutationTrackingAttributes {
  organization?: SysOrganization;
  projectDetails?: Project;
  booking?: FlatLandBooking;
  customerProfile?: CsCustomerProfile;
}
