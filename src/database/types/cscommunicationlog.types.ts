// Auto-generated types for CsCommunicationLog
// Source: src/database/models/customer-service/cs_communication_log.model.ts

import { CommChannel } from '../models/customer-service/cs_communication.types';
import { CommType } from '../models/customer-service/cs_communication.types';
import { CommStatus } from '../models/customer-service/cs_communication.types';

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';
import type { FlatLandBooking } from '../models/projects/flat-land-booking/pr_flat_land_booking.model';
import type { CsCustomerProfile } from '../models/customer-service/cs_customer_profile.model';

export interface CsCommunicationLogAttributes {
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
  commNo: string;
  customerName: string;
  phone?: string | null;
  email?: string | null;
  unit?: string | null;
  channel: CommChannel;
  type: CommType;
  subject?: string | null;
  content: string;
  status: CommStatus;
  scheduledFor?: Date | null;
  sentAt?: Date | null;
  sentBy?: string | null;
  metadata?: Record<string, any> | null;

  // Relations
  organization?: SysOrganization;
  project?: Project;
  booking?: FlatLandBooking;
  customerProfile?: CsCustomerProfile;
}

export interface CsCommunicationLogCreationAttributes {
  organizationId: number;
  createdBy?: number | null;
  updatedBy?: number | null;
  deletedBy?: number | null;
  projectId?: string | null;
  projectName?: string | null;
  bookingId?: string | null;
  customerProfileId?: number | null;
  commNo: string;
  customerName: string;
  phone?: string | null;
  email?: string | null;
  unit?: string | null;
  channel?: CommChannel; // Has default value
  type?: CommType; // Has default value
  subject?: string | null;
  content: string;
  status?: CommStatus; // Has default value
  scheduledFor?: Date | null;
  sentAt?: Date | null;
  sentBy?: string | null;
  metadata?: Record<string, any> | null;
}

export type CsCommunicationLogUpdateAttributes = Partial<CsCommunicationLogCreationAttributes>;

// Helper type for including relations
export interface CsCommunicationLogWithRelations extends CsCommunicationLogAttributes {
  organization?: SysOrganization;
  project?: Project;
  booking?: FlatLandBooking;
  customerProfile?: CsCustomerProfile;
}
