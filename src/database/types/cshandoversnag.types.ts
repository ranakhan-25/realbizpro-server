// Auto-generated types for CsHandoverSnag
// Source: src/database/models/customer-service/cs_handover_snag.model.ts

import { SnagSeverity } from '../models/customer-service/cs_handover.types';
import { SnagStatus } from '../models/customer-service/cs_handover.types';

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';
import type { CsBookingHandover } from '../models/customer-service/cs_booking_handover.model';
import type { FlatLandBooking } from '../models/projects/flat-land-booking/pr_flat_land_booking.model';

export interface CsHandoverSnagAttributes {
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
  handoverId?: number | null;
  bookingId?: string | null;
  snagCode: string;
  unitName: string;
  customerName: string;
  defectLocation: string;
  description: string;
  severity: SnagSeverity;
  assignedContractor?: string | null;
  targetRectificationDate?: string | null;
  status: SnagStatus;
  rectifiedDate?: string | null;
  remarks?: string | null;

  // Relations
  organization?: SysOrganization;
  project?: Project;
  handover?: CsBookingHandover;
  booking?: FlatLandBooking;
}

export interface CsHandoverSnagCreationAttributes {
  organizationId: number;
  createdBy?: number | null;
  updatedBy?: number | null;
  deletedBy?: number | null;
  projectId?: string | null;
  handoverId?: number | null;
  bookingId?: string | null;
  snagCode: string;
  unitName: string;
  customerName: string;
  defectLocation: string;
  description: string;
  severity?: SnagSeverity; // Has default value
  assignedContractor?: string | null;
  targetRectificationDate?: string | null;
  status?: SnagStatus; // Has default value
  rectifiedDate?: string | null;
  remarks?: string | null;
}

export type CsHandoverSnagUpdateAttributes = Partial<CsHandoverSnagCreationAttributes>;

// Helper type for including relations
export interface CsHandoverSnagWithRelations extends CsHandoverSnagAttributes {
  organization?: SysOrganization;
  project?: Project;
  handover?: CsBookingHandover;
  booking?: FlatLandBooking;
}
