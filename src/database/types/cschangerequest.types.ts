// Auto-generated types for CsChangeRequest
// Source: src/database/models/customer-service/cs_change_request.model.ts

import { ChangeRequestType } from '../models/customer-service/cs_change_request.model';
import { ChangeRequestStatus } from '../models/customer-service/cs_change_request.model';

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';
import type { CsCustomerProfile } from '../models/customer-service/cs_customer_profile.model';
import type { FlatLandBooking } from '../models/projects/flat-land-booking/pr_flat_land_booking.model';

export interface CsChangeRequestAttributes {
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
  requestCode: string;
  requestType: ChangeRequestType;
  customerProfileId?: number | null;
  customerName: string;
  unit: string;
  project?: string | null;
  bookingId?: string | null;
  reason?: string | null;
  transferFee: number;
  newBuyerName?: string | null;
  newBuyerNid?: string | null;
  newBuyerPhone?: string | null;
  status: ChangeRequestStatus;
  appliedDate: string;
  approvalNotes?: string | null;

  // Relations
  organization?: SysOrganization;
  projectDetails?: Project;
  customerProfile?: CsCustomerProfile;
  booking?: FlatLandBooking;
}

export interface CsChangeRequestCreationAttributes {
  organizationId: number;
  createdBy?: number | null;
  updatedBy?: number | null;
  deletedBy?: number | null;
  projectId?: string | null;
  requestCode: string;
  requestType: ChangeRequestType;
  customerProfileId?: number | null;
  customerName: string;
  unit: string;
  project?: string | null;
  bookingId?: string | null;
  reason?: string | null;
  transferFee?: number; // Has default value
  newBuyerName?: string | null;
  newBuyerNid?: string | null;
  newBuyerPhone?: string | null;
  status?: ChangeRequestStatus; // Has default value
  appliedDate?: string; // Has default value
  approvalNotes?: string | null;
}

export type CsChangeRequestUpdateAttributes = Partial<CsChangeRequestCreationAttributes>;

// Helper type for including relations
export interface CsChangeRequestWithRelations extends CsChangeRequestAttributes {
  organization?: SysOrganization;
  projectDetails?: Project;
  customerProfile?: CsCustomerProfile;
  booking?: FlatLandBooking;
}
