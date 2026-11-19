// Auto-generated types for CsSiteVisitAppointment
// Source: src/database/models/customer-service/cs_site_visit_appointment.model.ts

import { VisitPurpose } from '../models/customer-service/cs_communication.types';
import { VisitStatus } from '../models/customer-service/cs_communication.types';

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';
import type { FlatLandBooking } from '../models/projects/flat-land-booking/pr_flat_land_booking.model';
import type { CsCustomerProfile } from '../models/customer-service/cs_customer_profile.model';
import type { SysUser } from '../models/system/sys_user.model';

export interface CsSiteVisitAppointmentAttributes {
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
  projectName?: string | null;
  bookingId?: string | null;
  customerProfileId?: number | null;
  visitNo: string;
  customerName: string;
  phone?: string | null;
  unit?: string | null;
  visitPurpose: VisitPurpose;
  appointmentDate: string;
  timeSlot: string;
  assignedEscortId?: number | null;
  assignedEscort?: string | null;
  safetyPpeRequired: boolean;
  status: VisitStatus;
  customerNotes?: string | null;
  inspectionFindings?: string | null;
  checklist?: Array<{ item: string; checked: boolean; remarks?: string }> | null;

  // Relations
  organization?: SysOrganization;
  project?: Project;
  booking?: FlatLandBooking;
  customerProfile?: CsCustomerProfile;
  escortUser?: SysUser;
}

export interface CsSiteVisitAppointmentCreationAttributes {
  organizationId: number;
  createdBy?: number | null;
  updatedBy?: number | null;
  deletedBy?: number | null;
  projectId?: string | null;
  projectName?: string | null;
  bookingId?: string | null;
  customerProfileId?: number | null;
  visitNo: string;
  customerName: string;
  phone?: string | null;
  unit?: string | null;
  visitPurpose?: VisitPurpose; // Has default value
  appointmentDate: string;
  timeSlot?: string; // Has default value
  assignedEscortId?: number | null;
  assignedEscort?: string | null;
  safetyPpeRequired?: boolean; // Has default value
  status?: VisitStatus; // Has default value
  customerNotes?: string | null;
  inspectionFindings?: string | null;
  checklist?: Array<{ item: string; checked: boolean; remarks?: string }> | null;
}

export type CsSiteVisitAppointmentUpdateAttributes = Partial<CsSiteVisitAppointmentCreationAttributes>;

// Helper type for including relations
export interface CsSiteVisitAppointmentWithRelations extends CsSiteVisitAppointmentAttributes {
  organization?: SysOrganization;
  project?: Project;
  booking?: FlatLandBooking;
  customerProfile?: CsCustomerProfile;
  escortUser?: SysUser;
}
