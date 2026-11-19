// Auto-generated types for CsBookingHandover
// Source: src/database/models/customer-service/cs_booking_handover.model.ts

import { HandoverStatus } from '../models/customer-service/cs_handover.types';

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';
import type { FlatLandBooking } from '../models/projects/flat-land-booking/pr_flat_land_booking.model';
import type { CsCustomerProfile } from '../models/customer-service/cs_customer_profile.model';

export interface CsBookingHandoverAttributes {
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
  handoverCode?: string | null;
  customerName?: string | null;
  unitName?: string | null;
  projectName?: string | null;
  handoverStatus: HandoverStatus;
  targetHandoverDate?: string | null;
  readinessPercentage: number;
  jointInspectionDone: boolean;
  possessionCertIssued: boolean;
  possessionDate?: string | null;
  dlpStartDate?: string | null;
  dlpExpiryDate?: string | null;
  keyRegisterNo?: string | null;
  keysDeliveredCount: number;
  possessionCertNo?: string | null;
  electricMeterReading?: string | null;
  gasMeterReading?: string | null;
  waterMeterReading?: string | null;
  signedByCustomer: boolean;
  totalSnagsReported: number;
  totalSnagsResolved: number;
  remarks?: string | null;

  // Relations
  organization?: SysOrganization;
  project?: Project;
  booking?: FlatLandBooking;
  customerProfile?: CsCustomerProfile;
}

export interface CsBookingHandoverCreationAttributes {
  organizationId: number;
  createdBy?: number | null;
  updatedBy?: number | null;
  deletedBy?: number | null;
  projectId?: string | null;
  bookingId?: string | null;
  customerProfileId?: number | null;
  handoverCode?: string | null;
  customerName?: string | null;
  unitName?: string | null;
  projectName?: string | null;
  handoverStatus?: HandoverStatus; // Has default value
  targetHandoverDate?: string | null;
  readinessPercentage?: number; // Has default value
  jointInspectionDone?: boolean; // Has default value
  possessionCertIssued?: boolean; // Has default value
  possessionDate?: string | null;
  dlpStartDate?: string | null;
  dlpExpiryDate?: string | null;
  keyRegisterNo?: string | null;
  keysDeliveredCount?: number; // Has default value
  possessionCertNo?: string | null;
  electricMeterReading?: string | null;
  gasMeterReading?: string | null;
  waterMeterReading?: string | null;
  signedByCustomer?: boolean; // Has default value
  totalSnagsReported?: number; // Has default value
  totalSnagsResolved?: number; // Has default value
  remarks?: string | null;
}

export type CsBookingHandoverUpdateAttributes = Partial<CsBookingHandoverCreationAttributes>;

// Helper type for including relations
export interface CsBookingHandoverWithRelations extends CsBookingHandoverAttributes {
  organization?: SysOrganization;
  project?: Project;
  booking?: FlatLandBooking;
  customerProfile?: CsCustomerProfile;
}
