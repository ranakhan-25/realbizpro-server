// Auto-generated types for CsRegistrationTracking
// Source: src/database/models/customer-service/cs_registration_tracking.model.ts

import { DeedDraftStatus } from '../models/customer-service/cs_documents.types';
import { RegistrationStatus } from '../models/customer-service/cs_documents.types';

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';
import type { FlatLandBooking } from '../models/projects/flat-land-booking/pr_flat_land_booking.model';
import type { CsCustomerProfile } from '../models/customer-service/cs_customer_profile.model';

export interface CsRegistrationTrackingAttributes {
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
  regCode: string;
  customerName: string;
  unitName?: string | null;
  projectName?: string | null;
  subRegistrarOffice: string;
  deedDraftStatus: DeedDraftStatus;
  registrationDateScheduled?: string | null;
  totalGovtFees: number;
  feeReceiptCollected: boolean;
  registeredDeedNo?: string | null;
  status: RegistrationStatus;
  deliveredDate?: string | null;
  remarks?: string | null;

  // Relations
  organization?: SysOrganization;
  projectDetails?: Project;
  booking?: FlatLandBooking;
  customerProfile?: CsCustomerProfile;
}

export interface CsRegistrationTrackingCreationAttributes {
  organizationId: number;
  createdBy?: number | null;
  updatedBy?: number | null;
  deletedBy?: number | null;
  projectId?: string | null;
  bookingId?: string | null;
  customerProfileId?: number | null;
  regCode: string;
  customerName: string;
  unitName?: string | null;
  projectName?: string | null;
  subRegistrarOffice: string;
  deedDraftStatus?: DeedDraftStatus; // Has default value
  registrationDateScheduled?: string | null;
  totalGovtFees?: number; // Has default value
  feeReceiptCollected?: boolean; // Has default value
  registeredDeedNo?: string | null;
  status?: RegistrationStatus; // Has default value
  deliveredDate?: string | null;
  remarks?: string | null;
}

export type CsRegistrationTrackingUpdateAttributes = Partial<CsRegistrationTrackingCreationAttributes>;

// Helper type for including relations
export interface CsRegistrationTrackingWithRelations extends CsRegistrationTrackingAttributes {
  organization?: SysOrganization;
  projectDetails?: Project;
  booking?: FlatLandBooking;
  customerProfile?: CsCustomerProfile;
}
