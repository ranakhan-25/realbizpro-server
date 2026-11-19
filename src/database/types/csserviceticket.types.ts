// Auto-generated types for CsServiceTicket
// Source: src/database/models/customer-service/cs_service_ticket.model.ts

import { TicketCategory } from '../models/customer-service/cs_tickets.types';
import { TicketPriority } from '../models/customer-service/cs_tickets.types';
import { TicketStatus } from '../models/customer-service/cs_tickets.types';
import { TicketReplyItem } from '../models/customer-service/cs_tickets.types';

import type { SysOrganization } from '../models/system/sys_organization.model';
import type { Project } from '../models/projects/project/pr_project.model';
import type { FlatLandBooking } from '../models/projects/flat-land-booking/pr_flat_land_booking.model';
import type { CsCustomerProfile } from '../models/customer-service/cs_customer_profile.model';
import type { SysUser } from '../models/system/sys_user.model';

export interface CsServiceTicketAttributes {
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
  ticketNo: string;
  subject: string;
  customerName: string;
  phone?: string | null;
  unit?: string | null;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  assignedAgentId?: number | null;
  assignedAgent?: string | null;
  slaRemainingHours: number;
  slaTargetHours: number;
  isOverdue: boolean;
  dueDate?: Date | null;
  resolvedAt?: Date | null;
  closedAt?: Date | null;
  remarks?: string | null;
  replies: TicketReplyItem[];

  // Relations
  organization?: SysOrganization;
  projectDetails?: Project;
  booking?: FlatLandBooking;
  customerProfile?: CsCustomerProfile;
  assignedUser?: SysUser;
}

export interface CsServiceTicketCreationAttributes {
  organizationId: number;
  createdBy?: number | null;
  updatedBy?: number | null;
  deletedBy?: number | null;
  projectId?: string | null;
  projectName?: string | null;
  bookingId?: string | null;
  customerProfileId?: number | null;
  ticketNo: string;
  subject: string;
  customerName: string;
  phone?: string | null;
  unit?: string | null;
  category?: TicketCategory; // Has default value
  priority?: TicketPriority; // Has default value
  status?: TicketStatus; // Has default value
  assignedAgentId?: number | null;
  assignedAgent?: string | null;
  slaRemainingHours?: number; // Has default value
  slaTargetHours?: number; // Has default value
  isOverdue?: boolean; // Has default value
  dueDate?: Date | null;
  resolvedAt?: Date | null;
  closedAt?: Date | null;
  remarks?: string | null;
  replies?: TicketReplyItem[]; // Has default value
}

export type CsServiceTicketUpdateAttributes = Partial<CsServiceTicketCreationAttributes>;

// Helper type for including relations
export interface CsServiceTicketWithRelations extends CsServiceTicketAttributes {
  organization?: SysOrganization;
  projectDetails?: Project;
  booking?: FlatLandBooking;
  customerProfile?: CsCustomerProfile;
  assignedUser?: SysUser;
}
